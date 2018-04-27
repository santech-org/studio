for package in `find @santech -mindepth 1 -maxdepth 1 -type d`; do
  cd "${package}"
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
    && echo "Module Deja publié ${package}" \
    || (npm publish dist.tgz --verbose --access=public)
  cd ../..
done

