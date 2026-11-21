import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

app.get("/api{/:date}", function (req, res) {
  const { date } = req.params;
  let parsedDate;

  if (!date) {
    // Empty parameter: use the current time
    parsedDate = new Date();
  } else if (/^-?\d+$/.test(date)) {
    // Only digits: treat as a Unix timestamp in milliseconds
    parsedDate = new Date(Number(date));
  } else {
    // Anything else: let JavaScript try to parse it
    parsedDate = new Date(date);
  }

  // Invalid dates produce NaN when you ask for their time
  if (isNaN(parsedDate.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString()
  });
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
