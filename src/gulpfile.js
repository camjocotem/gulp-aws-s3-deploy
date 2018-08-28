var gulp = require('gulp'),
	env = require('node-env-file');

env(__dirname + '/../.env');

gulp.task('deploy', function () {
    var awspublish = require('gulp-awspublish'),
        aws = {};
     var aws = {
     	"accessKeyId": process.env.AWS_S3_KEY,
     	"secretAccessKey": process.env.AWS_S3_SECRET,
     	"params": {
     		Bucket: process.env.BUCKET
     	},
     	"region": 'us-east-1'
     };
    var publisher = awspublish.create(aws),
        headers = {
            'Cache-Control': 'max-age=315360000, no-transform, public'
        };

    return gulp.src('./build/**')
        //Files hosted in S3 would need to be compressed prior to upload.
        .pipe(awspublish.gzip({
            ext: '.gz'
        }))
        // Publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))
        // Create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())
        // Print upload updates to console
        .pipe(awspublish.reporter());
});