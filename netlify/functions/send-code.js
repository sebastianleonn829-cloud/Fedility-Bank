
export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json"
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        sent: false,
        message: "Method not allowed."
      })
    };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        sent: false,
        message: "Email service is not configured."
      })
    };
  }

  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({
      sent: false,
      message: "Email verification setup is not complete yet."
    })
  };
};
