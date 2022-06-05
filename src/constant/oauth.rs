
trait OAuthEndpoint{
    const BASE_URL: &'static str;
    const AUTHORIZE: &'static str = "/authorize";
    const TOKEN: &'static str = "/token";
    // fn authorize_url(client_id: String, redirect_uri: String, scope: String, response_type: String) -> String;
}


struct GoogleOAuthEndpoint;

impl OAuthEndpoint for GoogleOAuthEndpoint {
    const BASE_URL: &'static str = "https://accounts.google.com/o/oauth2";
    const AUTHORIZE: &'static str = "/auth";
    // fn authorize_url(client_id: String, redirect_uri: String, scope: String,
    //                 response_type: String="code") -> String {
    //
    //     let url:String = format!("{}{}?client_id={}&redirect_uri={}&scope={}",
    //                            Self::BASE_URL, Self::AUTHORIZE, client_id, redirect_uri, scope);
    //     url
    // }
}


#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
