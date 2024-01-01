pub fn replace_special_chars(input: &str, replace_with: char) -> String {
    let mut result = String::with_capacity(input.len());

    for c in input.chars() {
        if c.is_ascii_alphanumeric() || c == replace_with {
            result.push(c);
        } else {
            result.push(replace_with);
        }
    }
    result
}
