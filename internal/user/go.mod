module github.com/tackboon/cm-catalogue/internal/user

go 1.18

replace github.com/tackboon/cm-catalogue/internal/common => ../common/

require (
	firebase.google.com/go v3.13.0+incompatible
	github.com/go-chi/chi/v5 v5.0.7
	github.com/go-chi/render v1.0.2
	github.com/sirupsen/logrus v1.9.0
	github.com/tackboon/cm-catalogue/internal/common v0.0.0-00010101000000-000000000000
	google.golang.org/api v0.91.0
)

require (
	cloud.google.com/go v0.103.0 // indirect
	cloud.google.com/go/compute v1.7.0 // indirect
	cloud.google.com/go/firestore v1.6.1 // indirect
	cloud.google.com/go/iam v0.3.0 // indirect
	cloud.google.com/go/storage v1.24.0 // indirect
	github.com/ajg/form v1.5.1 // indirect
	github.com/go-chi/cors v1.2.1 // indirect
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/google/go-cmp v0.5.8 // indirect
	github.com/google/uuid v1.3.0 // indirect
	github.com/googleapis/enterprise-certificate-proxy v0.1.0 // indirect
	github.com/googleapis/gax-go/v2 v2.5.1 // indirect
	go.opencensus.io v0.23.0 // indirect
	golang.org/x/net v0.0.0-20220805013720-a33c5aa5df48 // indirect
	golang.org/x/oauth2 v0.0.0-20220722155238-128564f6959c // indirect
	golang.org/x/sys v0.0.0-20220804214406-8e32c043e418 // indirect
	golang.org/x/text v0.3.7 // indirect
	golang.org/x/xerrors v0.0.0-20220609144429-65e65417b02f // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/genproto v0.0.0-20220805133916-01dd62135a58 // indirect
	google.golang.org/grpc v1.48.0 // indirect
	google.golang.org/protobuf v1.28.1 // indirect
)
