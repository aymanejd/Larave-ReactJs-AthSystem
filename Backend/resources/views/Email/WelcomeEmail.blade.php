<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #dddddd;
        }
        .header h1 {
            color: #333333;
        }
        .content {
            padding: 20px 0;
            color: #555555;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #aaaaaa;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Our Platform!</h1>
        </div>
        <div class="content">
            <p>Hi {{ $name }} ({{ $email }}),</p>

            <p>We're thrilled to have you on board! Our platform is designed to provide you with the best experience possible.</p>

            <p>Feel free to explore, and if you have any questions, don't hesitate to reach out to our support team.</p>

            <a href="{{ url('/') }}" class="btn">Get Started</a>

            <p>We hope you enjoy your journey with us!</p>

            <p>Best regards,<br>The Falcons Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Summit Horizons LLC . All rights reserved.</p>
        </div>
    </div>
</body>
</html>
