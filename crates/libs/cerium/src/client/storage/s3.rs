use s3::bucket::Bucket;
use s3::creds::Credentials;
use s3::Region;
use tracing::info;

use crate::error::CeriumResult;

#[derive(Debug, Clone)]
pub struct S3Client {
    credentials: Credentials,
    region: Region
}


impl S3Client {
    pub fn new(access_key: &str, secret_key: &str, base_url: &str) -> CeriumResult<Self> {
        let region = Region::Custom { region: "orca".to_string(), endpoint: base_url.to_string() };

        let credentials = Credentials::new(Some(access_key), Some(secret_key), None, None, None)?;

        Ok(Self {
            credentials,
            region
        })


        // let response_data = bucket.put_object(format!("{id}.png").as_str(), content.as_slice()).await.expect("Got error");
        //
        // let base_url = base_url.parse::<BaseUrl>()?;
        // let static_provider = StaticProvider::new(access_key, secret_key, None);
        // let client = Client::new(base_url.clone(), Some(Box::new(static_provider)), None, None)?;
        // Ok(Self {
        //     client,
        // })
    }

    /// Get Bucket will return the Bucket object for the Any bucket based action
    pub fn get_bucket(&self, bucket_name: &str) -> CeriumResult<Bucket> {
        let mut bucket = Bucket::new(bucket_name, self.region.clone(), self.credentials.clone())?;
        bucket.set_path_style();
        Ok(bucket)
    }

    pub async fn list_bucket(&self) -> CeriumResult<()> {
        // let _bucket_obj = self.get_bucket(bucket)?
        // let buckets =self.client.list_buckets(&args).await?;
        Ok(())
    }

    pub async fn create(&self, bucket: &str, key: &str, data: &[u8]) -> CeriumResult<()> {
        let _bucket_obj = self.get_bucket(bucket)?;
        let result  = _bucket_obj.put_object(key, data).await?;
        Ok(())
    }

    pub async fn delete(&self, bucket: &String, key: &String) -> CeriumResult<()> {
        let _bucket_obj = self.get_bucket(bucket)?;
        let response  = _bucket_obj.delete_object(key).await?;
        info!("Deleted Object for {key} - Response {:?}", response);
        Ok(())
    }

}
//
// #[cfg(test)]
// mod tests {
//     use crate::client::storage::s3::S3Client;
//
//     // S3Client can be created with valid access_key, secret_key, and base_url
//     #[tokio::test]
//     async fn test_s3client_creation_with_valid_credentials() {
//         let access_key = "minioadmin";
//         let secret_key = "minioadmin";
//         let base_url = "http://localhost:9000";
//
//         let result = S3Client::new(access_key, secret_key, base_url);
//
//
//         assert!(result.is_ok());
//         // let r = result.unwrap().list_bucket().await;
//         let r = result.unwrap().create("orca", "id.png", "jj").await;
//         assert!(r.is_ok());
//     }
//
//     // S3Client can delete an object from a bucket with a valid key
//     #[tokio::test]
//     async fn test_s3client_delete_object_with_valid_key() {
//         let access_key = "valid_access_key";
//         let secret_key = "valid_secret_key";
//         let base_url = "valid_base_url";
//         let bucket = String::from("valid_bucket");
//         let key = String::from("valid_key");
//
//         let s3_client = S3Client::new(access_key, secret_key, base_url).unwrap();
//         let result = s3_client.delete(&bucket, &key).await;
//
//         assert!(result.is_ok());
//     }
//
//     // S3Client cannot be created with invalid access_key, secret_key, or base_url
//     #[test]
//     fn test_s3client_creation_with_invalid_credentials() {
//         let access_key = "invalid_access_key";
//         let secret_key = "invalid_secret_key";
//         let base_url = "invalid_base_url";
//
//         let result = S3Client::new(access_key, secret_key, base_url);
//
//         assert!(result.is_err());
//     }
//
//     // S3Client cannot delete an object from a non-existent bucket
//     #[tokio::test]
//     async fn test_s3client_delete_object_from_nonexistent_bucket() {
//         let access_key = "valid_access_key";
//         let secret_key = "valid_secret_key";
//         let base_url = "valid_base_url";
//         let bucket = String::from("nonexistent_bucket");
//         let key = String::from("valid_key");
//
//         let s3_client = S3Client::new(access_key, secret_key, base_url).unwrap();
//         let result = s3_client.delete(&bucket, &key).await;
//
//         assert!(result.is_err());
//     }
//
//     // S3Client cannot delete a non-existent object from a bucket
//     #[tokio::test]
//     async fn test_s3client_delete_nonexistent_object_from_bucket() {
//         let access_key = "valid_access_key";
//         let secret_key = "valid_secret_key";
//         let base_url = "valid_base_url";
//         let bucket = String::from("valid_bucket");
//         let key = String::from("nonexistent_key");
//
//         let s3_client = S3Client::new(access_key, secret_key, base_url).unwrap();
//         let result = s3_client.delete(&bucket, &key).await;
//
//         assert!(result.is_err());
//     }
//
//     // S3Client can handle errors returned by the S3 service
//     #[tokio::test]
//     async fn test_s3client_handle_s3_service_errors() {
//         let access_key = "valid_access_key";
//         let secret_key = "valid_secret_key";
//         let base_url = "valid_base_url";
//         let bucket = String::from("valid_bucket");
//         let key = String::from("valid_key");
//
//         let s3_client = S3Client::new(access_key, secret_key, base_url).unwrap();
//         let result = s3_client.delete(&bucket, &key).await;
//
//         assert!(result.is_err());
//     }
//
//
// }
