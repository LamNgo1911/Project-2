let url;
if (process.env.NODE_ENV === "production") {
  url = "https://wearmeout.onrender.com";
} else {
  // Use the local server URL when in development
  url = "http://localhost:5000"; // Change this to your local server's URL
}

export const imageAxios = url;
