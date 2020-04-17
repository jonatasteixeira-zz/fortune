/* Jonatas Teixeira
/  Scritp to convert fortune database to json format
*/

var fs = require('fs');

main()

function main(){
    let get_path = "./data";
    let put_path = "./full.json"
    var fortunes_list = [];

    exploreDir(get_path).forEach(function(path, idx, all) {
        fortunes_list.push({
            name: path, 
            list: get_fortunes(readFile(path))
        });
    });

    var json = JSON.stringify(fortunes_list);
    writeFile(put_path, json);
}

function writeFile(path, content){
    let fd = fs.openSync(path, "w+");
    fs.writeSync(fd, content, 0, "utf8");
    fs.closeSync(fd, (error) => {
        if (error) throw error;
    });
}

function get_fortunes(content) {
    let fortunes_list =[]
    content.split("%").forEach(function(fortune, idx, all) {
        let new_fortune = {text: "", author: "" };
        fortune.split("\n").forEach(function(line, idx, all){
            if (line !== "") {
                if (line.startsWith("\t\t--")) {
                    new_fortune.author = String(line).replace('\t', '').replace("--", "").trim();
                } else {
                    new_fortune.text += String(line) + "\n"
                }
            }
        });
        if (new_fortune.text !== "") {
            if (new_fortune.author === "") {
                new_fortune.author = "Unknow"
            }
            fortunes_list.push(new_fortune);
        }
    });
    return fortunes_list;
}

function exploreDir(path) {
    list_of_files=[]
    aux(path);

    function aux(path){
        if (fs.lstatSync(`${path}`).isDirectory()) {
            items = fs.readdirSync(path)
            items.forEach(function(item){
                aux(`${path}/${item}`)
            });
        } else {
            list_of_files.push(path)
        }
    }
    return list_of_files;
}

function readFile(path) {
    let content = ""
    if (fs.existsSync(path)) {
        let stats = fs.statSync(path);
        let fd = fs.openSync(path, "r");
        let buffer = Buffer.alloc(stats.size);
        fs.readSync(fd, buffer, 0, buffer.length)
        content = buffer.toString("utf8", 0, buffer.length);
        
        fs.closeSync(fd, (error) => {
            if (error) throw error;
        });
    }
    return content;
}

/* Util function used to debug */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}