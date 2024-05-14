<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot password</title>
</head>
<body>
    <div>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Enter your email" required>
    </div>
    <div>
        <button type="submit" onclick="submitForm(event)">Send</button>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js"></script>
    <script>
        function submitForm(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const myObj = {
                email: email
            }
            axios.post('http://localhost:3000/password/forgotpassword', myObj).then((response) => {
                alert('reset email sent');
            })
        }
    </script>
</body>
</html>
