PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')
PACKAGE_NAME=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

PUBLISHED_PACKAGE_VERSIONS=`npm show ${PACKAGE_NAME} versions --json`

echo $PUBLISHED_PACKAGE_VERSIONS | grep "\"$PACKAGE_VERSION\"" > /dev/null \
  && echo "Module Deja publié" \
  || (npm publish dist.tgz --verbose)