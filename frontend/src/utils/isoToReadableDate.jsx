const isoToReadableDate = (isoString) => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  hours = String(hours).padStart(2, "0");

  const readableDate = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  return readableDate;
};

export default isoToReadableDate;
