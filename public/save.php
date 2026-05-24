<?php

$conn = new mysqli("localhost", "root", "", "nextgenwork");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$phone = $_POST['phone'];
$service = $_POST['service'];
$message = $_POST['message'];

$sql = "INSERT INTO clients (name, phone,service, message)
VALUES ('$name', '$phone', '$service', '$message')";

if ($conn->query($sql) === TRUE) {
    echo "
    <script>
      alert('Message Sent Successfully!');
      window.location.href='index.html';
    </script>
    ";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();

?>