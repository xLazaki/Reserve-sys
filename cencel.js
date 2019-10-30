var my_data = []
var cancel_data = []
var today = new Date();
var todayD = today.getDate();
var todayM = today.getMonth();
var todayY = today.getFullYear();
var dateString = todayY + "-" + (todayM + 1) + "-" + todayD;
document.getElementById('DateId').setAttribute('value', dateString)
var timeslots = {
	0:"8.00-8.30",
	1:"8.30-9.00",
	2:"9.00-9.30",
	3:"9.30-10.00",
	4:"10.00-10.30",
	5:"10.30-11.00",
	6:"11.00-11.30",
	7:"11.30-12.00",
	8:"12.00-12.30",
	9:"12.30-13.00",
	10:"13.00-13.30",
	11:"13.30-14.00",
	12:"14.00-14.30",
	13:"14.30-15.00",
	14:"15.00-15.30",
	15:"15.30-16.00",
	16:"16.00-16.30",
	17:"16.30-17.00",
	18:"17.00-17.30",
	19:"17.30-18.00"
}

var Room = {}

axios({
	method: 'get', 
	url: 'https://api.pattanachai.xyz/rooms',
	headers: {
		Authorization: getCookie(getCookie('user'))
	},
	data: {name: 'testRoom'},
	}).then((response)=>{
		num = 0
		for (var item of response.data){
			Room[item['name']] = num
			num += 1
		}
		start()
	})

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function refresh() {
	table = document.getElementById('information')
	for (var i=table.rows.length-1 ; i>0 ; i--){
		table.deleteRow(i)
	}
	show(my_data)
}

function show(my_data) {
	var dateFromChosen = document.getElementById('DateId').value
	if (dateFromChosen == '') {dateFromChosen = 'testDate'}
	for (var list of my_data) {
		if (list[0] == dateFromChosen) {
			var tr_node = document.createElement("TR")
			tr_node.className = 'status';
			for (var i=0 ; i<3 ; i++){
				var node = document.createElement("TD");
				if (i == 1) {
					var Textnode = document.createTextNode(timeslots[list[2]]);
				} else if (i == 0){
					var Textnode = document.createTextNode(list[1]);
				} else {
					var Textnode = document.createTextNode("");
				}
				node.appendChild(Textnode);
				tr_node.appendChild(node);
			}
			n = document.getElementById('information')
			n.appendChild(tr_node)
			search = document.getElementsByClassName('status');
			target = search[search.length-1].children[2];
			if (dateFromChosen == 'testDate') {
				date = 9999
			} else {
				date = list[0].replace(/-/g,"")
			}
			target.innerHTML = "<button onclick='cancel(".concat(Room[list[1]], ',', list[2], ',', date, ',', search.length-1, ")' type=\"button\" class='btn btn-warning'>Cancel</button>");
		}
	}
}

function cancel(room, timeslot, date, slot) {
	cancel_data.push([room, timeslot, date, slot])
	target = document.getElementsByClassName('status')[slot].children[2];
	target.innerHTML = "<button onclick='re_reserve(".concat(room, ',', timeslot, ',', date, ',', slot, ")' type=\"button\" class='btn btn-danger'>Chosen</button>");
	// console.log(cancel_data)
}

function re_reserve(room, timeslot, date, slot){
	var delete_target = findIndex(cancel_data, [room, timeslot, date, slot]);
    cancel_data.splice(delete_target, 1);
    target = document.getElementsByClassName('status')[slot].children[2];
	target.innerHTML = "<button onclick='cancel(".concat(room, ',', timeslot, ',', date, ',', slot, ")' type=\"button\" class='btn btn-warning'>Cancel</button>");
	// console.log(cancel_data)
}

function findIndex(arr, target) {
    for (var i=0 ; i<arr.length ; i++) {
        if (arr[i][0] == target[0] && arr[i][1] == target[1] && arr[i][2] == target[2] && arr[i][3] == target[3]) {
            return i;
        }
    }
}

function generateObj(cancel_data) {
	var data = []
	var data_room
	var data_date
	for (item of cancel_data) {
		for (var key in Room) {
			if (Room[key] == item[0]) {
				data_room = key
			}
		}
		if (item[2] == 9999){
			data_date = 'testDate'
		} else {
			data_date = item[2].toString().slice(0,4).concat('-', item[2].toString().slice(4,6), '-', item[2].toString().slice(6,8))
		}
		data.push({
			room: data_room,
			date: data_date,
			slot: item[1]
		})
	}
	return data
}

function submit() {
	if (cancel_data.length == 0) {
		alert("Please choose time to cancel.")
	} else {
		axios({
	        method: 'patch', 
	        url: 'https://api.pattanachai.xyz/free',
	        headers: {
	            Authorization: getCookie(getCookie('user'))
	        },
	        data: generateObj(cancel_data),
	        }).then((response)=>{
			    if(response.data.success){
			        //free successfully
					alert('Cancel Room Success!')
					for(var item of cancel_data) {
						var index = item[3];
                        n = document.getElementById('information').children[index+1].children[2];
                        n.innerHTML = "<button type=\"button\" class='btn btn-danger'>Canceled</button>";
					}
					cancel_data = []
			    }
			    else{
			    	//can't free
			    	// response.data.fail <-- array ของการจองที่ยกเลิกไม่ได้ทั้งหมด
			    	console.log(response.data.fail)
			    } 
	        }).catch((err)=>{
	            if(err.response.status==401){
	                //not logged in (didn't attach token in the header)
	                alert('please login');
	            }
	        })
    }
}

function newSort(data) {
	new_data = []
	data.sort()
	for (var i=0 ; i<20 ; i++) {
		for (var list of data) {
			if (list[2] == i) {
				//Date/Room/Slot
				new_data.push([list[0], list[1], list[2]])
			}
		}

	}
	return new_data
}

function start(){
	axios({
			method: 'get', 
			url: 'https://api.pattanachai.xyz/userReservations',
			headers: {
				Authorization: getCookie(getCookie('user'))
			},
			}).then((response)=>{
				//response.data <- Array ของการจองทั้งหมด
				// console.log(response.data)
				reserv = response.data
				for(i=0;i<reserv.length;++i){
					// console.log(reserv[i].room+' '+reserv[i].date+' '+reserv[i].slot)
					my_data.push([reserv[i].date, reserv[i].room, parseInt(reserv[i].slot, 10)])
				}
				my_data = newSort(my_data)
				show(my_data);
			}).catch((err)=>{
				if(err.response.status==401){
					//not logged in (didn't attach token in the header)
					alert('please login');
				}
			})
}