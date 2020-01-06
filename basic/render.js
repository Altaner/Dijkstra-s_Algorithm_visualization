window.onload=function() {
    canv=document.getElementById("myCanvas");
    ctx=canv.getContext("2d");
	
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canv.width,canv.height);
	
	num = 5
	gs = canv.height/num; //grid size
	//console.log(gs);
	tc = (canv.height*canv.width)/(gs*gs) //tile_count
	//console.log(tc);
	
	box = 65;
	mat = {};
	conn_mat = {};
	var temp = [];
	for (var i=0; i<canv.height; i+=gs){
		for (var j=0; j<canv.width; j+=gs){
			ctx.beginPath();
				ctx.fillStyle = "white";
				//console.log(j)
				x1 = j+1;
				y1 = i+1;
				x2 = j+gs-1;
				y2 = i+gs-2;
				//console.log("point 1: ", x1, y1);
				//console.log("point 2: ", x2, y2);
				ctx.moveTo(x1, y1, x2, y2);
				ctx.lineTo(x1,y2);
				ctx.lineTo(x2,y2);
				ctx.lineTo(x2, y1);
				ctx.fill();
				ctx.fillStyle = "blue";
				ctx.font = "18px Arial";
				cx = x1+(x2-x1)/2;
				cy = y1+(y2-y1)/2;
				//console.log("character coord: ", cx, cy);
				ctx.fillText(String.fromCharCode(box), cx-4, cy+4);
			ctx.closePath();
			temp.push(cx-4);
			temp.push(cy+4);
			window.mat[String.fromCharCode(box)] = temp;
			temp= [];
			//console.log(window.mat);
			box++;
			
		}
	}
	
	
	for (key in mat){
		conn_mat[key] = [];
	}
	//console.log(conn_mat);
	for (key1 in mat){
		//console.log(key1, ": ",mat[key1[0]]);
		for (key2 in mat){
			dist = Math.sqrt(Math.pow((mat[key2][0]-mat[key1][0]), 2) + Math.pow((mat[key2][1]-mat[key1][1]), 2))
			//console.log("distance between ",key1, " and ", key2, " is ", dist);
			if (dist <142 && dist != 0){
				temp = conn_mat[key1];
				temp.push(key2);
				conn_mat[key1] = temp;
				//console.log(conn_mat[key1]);
			}
			else{
				continue;
			}
		}
	}

//console.log("connection matrix is: ", conn_mat);
//console.log("the central points nodes are: ", mat);

}

function graph(){
	console.log("connection matrix is: ", conn_mat);
	console.log("the central points nodes are: ", mat);
	var source = document.getElementById("source").value;
	var dest = document.getElementById("dest").value;
	
	visited = [];
	shortest_path_dict = {};
	visit = [];
	changed={};
	track = {};
	
	
	console.log("source is: ", source);
	console.log("destination is: ", dest);
	dist_frm_src = {};
	for (key in mat){
		if (key == source){
			dist_frm_src[key] = 0;
			//visited.push(key);
		}
		else{
			dist_frm_src[key] = Infinity;
		}
	}
	console.log("initial distance from source: ", dist_frm_src)
	td = 25; //total nodes
	values = [];
	flag=true;
	m=0
	while (flag){
		console.log("\niteration: ", m+1);
		for (key in dist_frm_src){
			//console.log("\nThe node is: ", key);
			if (not_visited_node(key) && dist_frm_src[key] != Infinity){
				//console.log("have to visit node ", key," and change connected nodes");
				visit.push(key);
			}
			else{
				continue;
			}
		}
		console.log("nodes to visit: ", visit);
		
		minimum = min(visit);
		console.log("minimum value among nodes to change: ",minimum);
		if (minimum == Infinity){
			flag=false;
		}
		for (var n=0;n<visit.length;n++){
			if (dist_frm_src[visit[n]] == minimum ){
				console.log("visiting node: ", visit[n]);
				connected = conn_mat[visit[n]];
				console.log("connected nodes: ", connected);
				conn_but_not_visited = connected.filter( ( el ) => !visited.includes( el ) );
				console.log("connected but not visited nodes are: ",conn_but_not_visited);
				for (var p=0;p<conn_but_not_visited.length;p++ ){
					if (dist_frm_src[conn_but_not_visited[p]]>dist_frm_src[visit[n]]+1){
						dist_frm_src[conn_but_not_visited[p]] = dist_frm_src[visit[n]]+1;
						changed[conn_but_not_visited[p]] = [dist_frm_src[visit[n]]+1, visit[n]];
					}
				}
				visited.push(visit[n]);
				break;
			}
			else{
				console.log("value is higher, so no change...!!");
			}
		}
		console.log("distance from source is: ", dist_frm_src);
		console.log("visited nodes: ", visited);
		console.log("changed nodes are: ", changed);
		s=0;
		temp=[];
		for (key in changed){
			temp.push(key);
		}
		mini = min(temp);
		s=[0];
		for (key in changed){
			if (changed[key][s]==mini){
				shortest_path_dict[key] = changed[key]; 
			}
		}
		console.log("changed nodes are:")
		console.log("Shortest path among nodes: ", shortest_path_dict);
		changed={};
		visit = [];
				m++;
	}
	console.log("shortest distance is: ", dist_frm_src);
	console.log("the shortest path dictionary is: ", shortest_path_dict);
	path=[];
	path.push(dest);
	while (dest != source){
		path.push(shortest_path_dict[dest][1]);
		dest = shortest_path_dict[dest][1];
	}
	console.log("the sortest path is: ", path);
	console.log("drawing path");
	ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.lineWidth = 5;
		ctx.moveTo(mat[path[0]][0], mat[path[0]][1]);
		for (var t= 1;t<path.length;t++){
			ctx.lineTo(mat[path[t]][0], mat[path[t]][1]);
		}
		ctx.stroke();
	ctx.closePath();
	console.log("done");
}

function min(nodes) {
	 input=[];
	 for (var q=0;q<nodes.length;q++){
		input.push(dist_frm_src[nodes[q]]);
		//console.log("input is: ", input);
	 }
     if (toString.call(input) !== "[object Array]")  
       return false;
  return Math.min.apply(null, input);
	}

function not_visited_node(node){
	//console.log("nodes in visited: ", visited);
	for (var r=0;r<visited.length; r++){
		if (visited[r] == node){
			//console.log("visited");
			return false;
		}
		else{
			continue;
		}
	}
	//console.log("not started")
	return true;
}

