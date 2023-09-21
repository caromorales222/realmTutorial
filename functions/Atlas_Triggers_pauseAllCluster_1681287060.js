
exports = async function() {
  
  // Supply projectID and clusterNames...
  const projectID = '623b0a53e963024116b73fea';
  
  // Get stored credentials...
  const username = context.values.get("AtlasPublicKey");
  const password = context.values.get("AtlasPrivateKey");
  
  //Get clusterNames
  const argListClusters = { 
    scheme: 'https', 
    host: 'cloud.mongodb.com', 
    path: `api/atlas/v1.0/groups/${projectID}/clusters`, 
    username: username, 
    password: password,
    headers: {'Content-Type': ['application/json'], 'Accept-Encoding': ['bzip, deflate']}, 
    digestAuth:true,
  };
  
  // The response body is a BSON.Binary object. Parse it and get list of clusters
  response = await context.http.get(argListClusters);
  clusters = EJSON.parse(response.body.text()).results

  clusters.forEach(async function (cluster){
    
    //Pause or delete cluster
    const argsClusterAction = { 
      scheme: 'https', 
      host: 'cloud.mongodb.com', 
      path: 'api/atlas/v1.0/groups/' + projectID + '/clusters/' + cluster.name, 
      username: username, 
      password: password,
      headers: {'Content-Type': ['application/json'], 'Accept-Encoding': ['bzip, deflate']}, 
      digestAuth:true
    };
    
    let actionBody = {}
    let message = ""
    let response = ""
    
    
      message = "paused";
      
      actionBody = {paused: true};
      argsClusterAction.body=JSON.stringify(actionBody);
      response = await context.http.patch(argsClusterAction);
    
   
    if (message != "")
      console.log("Cluster " + cluster.name + " is " + message)
    else
      console.log("Nothing to do with cluster " + cluster.name)
  })

  return "Function ended"
};
