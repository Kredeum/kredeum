const multipart = function (parts, boundary) {
  let ret = "";

  parts.forEach((part) => {
    const type = part.type || "text";
    const name = part.name || "name";
    const content = part.content || "";

    let disp = `Content-Disposition: form-data; name=${name};\r\n`;

    ret += `--${boundary}\r\n`;

    if (type == "text") {
      ret += "Content-Type: text/plain\r\n";
    } else if (type == "file") {
      ret += "Content-Type: application/octet-stream\r\n";
      disp = `Content-Disposition: form-data; name=file; filename=${name}\r\n`;
    } else if (type == "json") {
      ret += "Content-Type: application/json\r\n";
    } else if (type == "html") {
      ret += "Content-Type: text/html\r\n";
    }
    ret += `${disp}\r\n${content}\r\n`;
  });
  ret += `--${boundary}--\r\n`;

  return ret;
};

export default multipart;
