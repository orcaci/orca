use s3::bucket::Bucket;
use s3::creds::Credentials;
use s3::Region;
use tracing::info;

use crate::error::CeriumResult;

#[derive(Debug, Clone)]
pub struct S3Client {
    credentials: Credentials,
    region: Region,
}

/// S3Client represents a client for interacting with Amazon S3 storage.
impl S3Client {
    /// Creates a new S3Client instance.
    ///
    /// # Arguments
    ///
    /// * `access_key` - The access key for authenticating with Amazon S3.
    /// * `secret_key` - The secret key for authenticating with Amazon S3.
    /// * `base_url` - The base URL for the Amazon S3 endpoint.
    ///
    /// # Returns
    ///
    /// A CeriumResult containing the new S3Client instance if successful, or an error if the creation fails.
    pub fn new(access_key: &str, secret_key: &str, base_url: &str) -> CeriumResult<Self> {
        let region = Region::Custom {
            region: "orca".to_string(),
            endpoint: base_url.to_string(),
        };

        let credentials = Credentials::new(Some(access_key), Some(secret_key), None, None, None)?;

        Ok(Self {
            credentials,
            region,
        })
    }

    /// Get Bucket will return the Bucket object for the Any bucket based action.
    ///
    /// # Arguments
    ///
    /// * `bucket_name` - The name of the bucket.
    ///
    /// # Returns
    ///
    /// A CeriumResult containing the Bucket object if successful, or an error if the retrieval fails.
    pub fn get_bucket(&self, bucket_name: &str) -> CeriumResult<Bucket> {
        let mut bucket = Bucket::new(bucket_name, self.region.clone(), self.credentials.clone())?;
        bucket.set_path_style();
        Ok(bucket)
    }

    /// Asynchronously lists the buckets.
    ///
    /// # Returns
    ///
    /// A CeriumResult indicating success or failure.
    pub async fn list_bucket(&self) -> CeriumResult<()> {
        // let _bucket_obj = self.get_bucket(bucket)?
        // let buckets =self.client.list_buckets(&args).await?;
        Ok(())
    }

    /// Asynchronously creates a new object in the specified bucket.
    ///
    /// # Arguments
    ///
    /// * `bucket` - The name of the bucket.
    /// * `key` - The key of the object.
    /// * `data` - The data of the object.
    ///
    /// # Returns
    ///
    /// A CeriumResult indicating success or failure.
    pub async fn create(&self, bucket: &str, key: &str, data: &[u8]) -> CeriumResult<()> {
        let _bucket_obj = self.get_bucket(bucket)?;
        let result = _bucket_obj.put_object(key, data).await?;
        Ok(())
    }

    /// Asynchronously deletes an object from the specified bucket.
    ///
    /// # Arguments
    ///
    /// * `bucket` - The name of the bucket.
    /// * `key` - The key of the object.
    ///
    /// # Returns
    ///
    /// A CeriumResult indicating success or failure.
    pub async fn delete(&self, bucket: &String, key: &String) -> CeriumResult<()> {
        let _bucket_obj = self.get_bucket(bucket)?;
        let response = _bucket_obj.delete_object(key).await?;
        info!("Deleted Object for {key} - Response {:?}", response);
        Ok(())
    }
}
