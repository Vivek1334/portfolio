package com.portfolio;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import javax.net.ssl.SSLSocketFactory;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

public final class PortfolioServer {
    private static final int PORT = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
    private static final Path ROOT = Path.of("").toAbsolutePath();
    private static final Path DIST_DIR = ROOT.resolve("dist").normalize();
    private static final Path MESSAGES_FILE = ROOT.resolve("backend").resolve("data").resolve("messages.jsonl");

    private static final String PORTFOLIO_JSON = """
        {
          "projects": [
            {
              "title": "Form-Craft",
              "category": "Frontend",
              "year": "2025",
              "desc": "An interactive, visual form builder application built with React. Allows users to create dynamic schema-based forms with live validation.",
              "stack": ["React", "JavaScript", "HTML5", "CSS3"],
              "accent": "#d4ff00",
              "shape": "lines",
              "url": "https://survey-builder-ll65.onrender.com",
              "image": "/form-craft.jpg"
            }
          ],
          "skills": [
            { "name": "Java SE / Core Java", "level": 88 },
            { "name": "Spring Boot / Hibernate", "level": 82 },
            { "name": "React / TypeScript", "level": 80 },
            { "name": "SQL (PostgreSQL & MySQL)", "level": 85 },
            { "name": "RESTful Web Services", "level": 85 },
            { "name": "HTML5 / CSS3 (Tailwind)", "level": 85 },
            { "name": "Git & Version Control", "level": 80 },
            { "name": "Docker (Containerization)", "level": 70 }
          ]
        }
        """;

    private PortfolioServer() {
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api/portfolio", PortfolioServer::handlePortfolio);
        server.createContext("/api/contact", PortfolioServer::handleContact);
        server.createContext("/", PortfolioServer::handleStatic);
        server.setExecutor(null);
        server.start();

        System.out.println("Java full-stack portfolio running at http://localhost:" + PORT);
        System.out.println("Serving website files from " + DIST_DIR);
    }

    private static void handlePortfolio(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        sendJson(exchange, 200, PORTFOLIO_JSON);
    }

    private static void handleContact(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        String body;
        try (InputStream requestBody = exchange.getRequestBody()) {
            body = new String(requestBody.readAllBytes(), StandardCharsets.UTF_8).trim();
        }

        if (body.isBlank() || body.length() > 10_000) {
            sendJson(exchange, 400, "{\"error\":\"Invalid message\"}");
            return;
        }

        Files.createDirectories(MESSAGES_FILE.getParent());
        String storedMessage = "{\"receivedAt\":\"" + escapeJson(Instant.now().toString()) + "\",\"payload\":" + body + "}";
        Files.writeString(
            MESSAGES_FILE,
            storedMessage + System.lineSeparator(),
            StandardCharsets.UTF_8,
            java.nio.file.StandardOpenOption.CREATE,
            java.nio.file.StandardOpenOption.APPEND
        );

        boolean emailSent = sendContactEmail(body);
        sendJson(exchange, 201, "{\"status\":\"received\",\"emailSent\":" + emailSent + "}");
    }

    private static boolean sendContactEmail(String body) {
        String host = System.getenv("SMTP_HOST");
        String username = System.getenv("SMTP_USERNAME");
        String password = System.getenv("SMTP_PASSWORD");
        String to = System.getenv().getOrDefault("CONTACT_TO_EMAIL", "vivek130304@gmail.com");

        if (isBlank(host) || isBlank(username) || isBlank(password) || isBlank(to)) {
            System.out.println("Contact message saved locally. SMTP is not configured, so no email was sent.");
            return false;
        }

        int port = Integer.parseInt(System.getenv().getOrDefault("SMTP_PORT", "465"));
        String from = System.getenv().getOrDefault("SMTP_FROM_EMAIL", username);

        try {
            sendSmtpEmail(host, port, username, password, from, to, body);
            return true;
        } catch (IOException exception) {
            System.err.println("Contact message saved locally, but email delivery failed: " + exception.getMessage());
            return false;
        }
    }

    private static void sendSmtpEmail(
        String host,
        int port,
        String username,
        String password,
        String from,
        String to,
        String body
    ) throws IOException {
        try (
            Socket socket = SSLSocketFactory.getDefault().createSocket(host, port);
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8))
        ) {
            expect(reader, 220);
            command(writer, reader, "EHLO localhost", 250);
            command(writer, reader, "AUTH LOGIN", 334);
            command(writer, reader, base64(username), 334);
            command(writer, reader, base64(password), 235);
            command(writer, reader, "MAIL FROM:<" + from + ">", 250);
            command(writer, reader, "RCPT TO:<" + to + ">", 250);
            command(writer, reader, "DATA", 354);

            writer.write(buildEmailMessage(from, to, body));
            writer.write("\r\n.\r\n");
            writer.flush();
            expect(reader, 250);
            command(writer, reader, "QUIT", 221);
        }
    }

    private static String buildEmailMessage(String from, String to, String body) {
        return String.join(
            "\r\n",
            "From: " + from,
            "To: " + to,
            "Subject: New portfolio contact message",
            "MIME-Version: 1.0",
            "Content-Type: text/plain; charset=UTF-8",
            "",
            "A visitor submitted your portfolio contact form.",
            "",
            body.replace("\r\n", "\n").replace("\n", "\r\n")
        );
    }

    private static void command(BufferedWriter writer, BufferedReader reader, String command, int expectedCode) throws IOException {
        writer.write(command + "\r\n");
        writer.flush();
        expect(reader, expectedCode);
    }

    private static void expect(BufferedReader reader, int expectedCode) throws IOException {
        String line = reader.readLine();
        if (line == null) {
            throw new IOException("SMTP server closed the connection");
        }

        String lastLine = line;
        while (line.length() >= 4 && line.charAt(3) == '-') {
            line = reader.readLine();
            if (line == null) break;
            lastLine = line;
        }

        if (!lastLine.startsWith(String.valueOf(expectedCode))) {
            throw new IOException("SMTP expected " + expectedCode + " but received: " + lastLine);
        }
    }

    private static String base64(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static void handleStatic(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod()) && !"HEAD".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendText(exchange, 405, "Method not allowed", "text/plain; charset=utf-8");
            return;
        }

        URI requestUri = exchange.getRequestURI();
        String requestedPath = requestUri.getPath().equals("/") ? "/index.html" : requestUri.getPath();
        Path staticFile = DIST_DIR.resolve(requestedPath.substring(1)).normalize();

        if (!staticFile.startsWith(DIST_DIR) || !Files.exists(staticFile) || Files.isDirectory(staticFile)) {
            staticFile = DIST_DIR.resolve("index.html");
        }

        if (!Files.exists(staticFile)) {
            sendText(exchange, 404, "Run npm run build first to generate the website.", "text/plain; charset=utf-8");
            return;
        }

        byte[] bytes = Files.readAllBytes(staticFile);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", contentType(staticFile));
        exchange.sendResponseHeaders(200, "HEAD".equalsIgnoreCase(exchange.getRequestMethod()) ? -1 : bytes.length);

        if (!"HEAD".equalsIgnoreCase(exchange.getRequestMethod())) {
            try (OutputStream responseBody = exchange.getResponseBody()) {
                responseBody.write(bytes);
            }
        } else {
            exchange.close();
        }
    }

    private static void sendJson(HttpExchange exchange, int status, String json) throws IOException {
        sendText(exchange, status, json, "application/json; charset=utf-8");
    }

    private static void sendText(HttpExchange exchange, int status, String text, String contentType) throws IOException {
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "no-store");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream responseBody = exchange.getResponseBody()) {
            responseBody.write(bytes);
        }
    }

    private static String contentType(Path path) {
        String fileName = path.getFileName().toString().toLowerCase();
        Map<String, String> types = Map.ofEntries(
            Map.entry(".html", "text/html; charset=utf-8"),
            Map.entry(".js", "text/javascript; charset=utf-8"),
            Map.entry(".css", "text/css; charset=utf-8"),
            Map.entry(".svg", "image/svg+xml"),
            Map.entry(".png", "image/png"),
            Map.entry(".jpg", "image/jpeg"),
            Map.entry(".jpeg", "image/jpeg"),
            Map.entry(".ico", "image/x-icon"),
            Map.entry(".xml", "application/xml; charset=utf-8"),
            Map.entry(".txt", "text/plain; charset=utf-8")
        );

        return types.entrySet().stream()
            .filter(entry -> fileName.endsWith(entry.getKey()))
            .map(Map.Entry::getValue)
            .findFirst()
            .orElse("application/octet-stream");
    }

    private static String escapeJson(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r");
    }
}
