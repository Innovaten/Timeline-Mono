

export function validPhoneNumber(number: string): string{
    number.replace(" ", "");
    number.replace("+", "");
    number.replace("-", "")

    if(number.startsWith("0")){
        number = "233" + number.substring(1);
    }

    // Check phone codes.

    return number;
}