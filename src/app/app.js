import angular from "angular";
import "angular-file-upload";
import "angular-resource";
import "angular-route";

import "bootstrap/dist/css/bootstrap.css";

class MediaFileController {
    constructor($scope, mediaFileResource, $routeParams) {
        this.$scope = $scope;
        this.mediaFileResource = mediaFileResource;

        this.id = $routeParams.id;

        this.$scope.mediaFile = null;
        this.$scope.updateMediaFile = this.updateMediaFile.bind(this);

        this.updateMediaFile();
    }

    updateMediaFile() {
        this.mediaFileResource.get({ id: this.id }, (mediaFile) => {
            this.$scope.mediaFile = mediaFile;
        });
    }
}

class UploadsController {
    constructor($scope, API_URL, FileUploader, uploadedMediaFileResource) {
        this.$scope = $scope;
        this.uploadedMediaFileResource = uploadedMediaFileResource;

        $scope.uploader = new FileUploader({
            url: `${API_URL}/media_files/uploads/upload`,
            onSuccessItem: this.updateUploadedFilesList.bind(this),
        });

        this.$scope.uploadedMediaFiles = [];
        this.$scope.updateUploadedFilesList = this.updateUploadedFilesList.bind(this);
        this.updateUploadedFilesList();
    }

    updateUploadedFilesList() {
        this.uploadedMediaFileResource.query((uploadedMediaFiles) => {
            this.$scope.uploadedMediaFiles = uploadedMediaFiles;
        });
    }
}

var app = angular.module("app", [
    "angularFileUpload",
    "ngResource",
    "ngRoute",
]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            controller: "UploadsController",
            template: require("./uploads.html"),
        })
        .when("/media_files/:id", {
            controller: "MediaFileController",
            template: require("./media_file.html"),
        })
        ;
});

app.controller("MediaFileController", ["$scope", "MediaFile", "$routeParams", MediaFileController]);
app.controller("UploadsController", ["$scope", "API_URL", "FileUploader", "UploadedMediaFile", UploadsController]);

app.factory("MediaFile", function(API_URL, $resource) {
    return $resource(`${API_URL}/media_files/:id`);
});
app.factory("UploadedMediaFile", function(API_URL, $resource) {
    return $resource(`${API_URL}/media_files/uploads/:id`);
});

app.value("API_URL", "http://localhost:8000/api/v1");

export default "app";
