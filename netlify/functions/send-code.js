
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sent: false,
        message: "Method not allowed."
      })
    };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sent: false,
        message: "Email service is not configured."
      })
    };
  }

  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sent: false,
      message: "Email verification setup is not complete yet."
    })
  };
};
