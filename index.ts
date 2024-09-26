import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const bucket = new aws.s3.Bucket("my-bucket");

const webConfig = new aws.s3.BucketWebsiteConfigurationV2("website-config", {
    bucket: bucket.id,
    indexDocument: {
        suffix: "index.html"
    }
})

const controls = new aws.s3.BucketOwnershipControls("ownership-controls", {
    bucket: bucket.id,
    rule: {
        objectOwnership: "ObjectWriter"
    }
});

const block = new aws.s3.BucketPublicAccessBlock("public-access-block", {
    bucket: bucket.id,
    blockPublicAcls: false
});

const object = new aws.s3.BucketObject("index.html", {
    bucket: bucket.id,
    source: new pulumi.asset.FileAsset("./index.html"),
    contentType: "text/html",
    acl: "public-read"
}, { dependsOn: [block, controls] });

export const bucketName = bucket.id;
export const endpoint = pulumi.interpolate`http://${webConfig.websiteEndpoint}`
