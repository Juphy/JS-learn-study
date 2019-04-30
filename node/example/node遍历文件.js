let fs = require("fs"),
    Path = "./spider";

const handle_all_files = async(path, callback) => {
    let files = fs.readdirSync(path);
    files.forEach(file => {
        callback(path, file);
    })
}

const rename = async(originPath, newPath) => {
    fs.rename(originPath, newPath, (err) => {
        if (err) {
            console.log(originPath, newPath);
            throw err;
        }
    })
}

let middle = async(path, filename) => {
    let originPath = path + '/' + filename;
    console.log(originPath);
    if (fs.statSync(originPath).isFile()) {
        // let newPath = path + '/' + originPath.split('-').pop();
        let newPath = path + '/' + 'AAA-' + filename;
        rename(originPath, newPath);
    } else if (fs.statSync(originPath).isDirectory()) {
        handle_all_files(path + '/' + filename, middle);
    }
}

handle_all_files(Path, middle);