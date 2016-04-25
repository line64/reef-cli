export default function (line){

    if( line.search('[;]') === -1 ){
        throw new Error("Bad parameters");
    }

    let values = line.split(';', 3);

    let parsedLine = {
        type: values[0].toUpperCase().trim(),
        command: values[1].toUpperCase().trim(),
        payload: JSON.parse(values[2].trim())
        }

    if( parsedLine.type == null || parsedLine.type == undefined
        || parsedLine.command == null || parsedLine.command == undefined
        || parsedLine.payload == null || parsedLine.command == undefined){
            throw new Error("Bad parameters");
        }

    return parsedLine;

}
