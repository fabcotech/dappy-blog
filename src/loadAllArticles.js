export const loadAllArticles = filesRegistryUri => {
  return new Promise((resolve, reject) => {
    dappyRChain
      .fetch(`dappy://rchain/betanetwork/${filesRegistryUri}`)
      .then(a => {
        const response = JSON.parse(a);
        const rholangTerm = response.expr[0];
        const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
        const articlesIds = Object.keys(jsValue.files).filter(
          k => k !== "index"
        );
        if (articlesIds.length) {
          dappyRChain
            .fetch(
              `dappy://rchain/betanetwork/${articlesIds
                .map(k => {
                  return `${filesRegistryUri.replace("rho:id:", "")}.${k}`;
                })
                .join(",")}`
            )
            .then(b => {
              let articles;
              if (articlesIds.length === 1) {
                const response = JSON.parse(b);
                const rholangTermArticle = response.expr[0];
                const article = blockchainUtils.rhoValToJs(rholangTermArticle);
                articles = { [article.id]: article };
              } else {
                const response = JSON.parse(b);
                articles = {};
                response.results.forEach(r => {
                  if (!r.success) {
                    console.error("One explore-deploy call was not successful");
                    return;
                  }
                  const a = blockchainUtils.rhoValToJs(
                    JSON.parse(r.data).expr[0]
                  );
                  articles[a.id] = a;
                });
              }
              resolve(articles);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve([]);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
