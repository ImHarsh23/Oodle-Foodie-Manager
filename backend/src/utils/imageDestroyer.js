import fs from "fs"

export default function (filePath) {
    fs.unlinkSync(filePath);
}