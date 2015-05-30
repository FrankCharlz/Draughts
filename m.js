var kete = ["<img src='img/kete2.png'>", "<img src='img/kete1.png'>"];
var whose_turn = 0;


function makeBoard() {
    var i = 0, j;
    while (i < 8 ) {
        $(".board").append("<div class=row id=row"+i+"></div>");
        j=0;
        while (j < 8) {
            $("#row"+i+"").append("<div class=cell id=cell_"+i+"_"+j+"></div>");
            j++;
        }
        i++;
    }
}

$(document).ready(function(){

    makeBoard();
    fillKete();

    var carrying = false;
    var from;
    var carried_kete_type;

    $(".cell").click(function() {
        var id =  $(this).attr('id');
        var kete_type = getKeteType(id);

        log("clicked : "+id+" kete_type : "+kete_type);


        if (!carrying) {
            if(kete_type != -1 && kete_type == whose_turn) {
                //if box not empty pick the kete
                carried_kete_type = kete_type;
                from = id;
                carrying = true;
                log("Move started: PLAYER["+carried_kete_type+"]");
            }
            if (kete_type != whose_turn) {
                alert("Not your turn bitch..");
            }
        }
        else
        {
            //if carrying..
            if (canDropHere(from, id, carried_kete_type, kete_type)) {
                //if box empty drop the kete and is allowed to drop
                removeKete(from);
                putKete(id, carried_kete_type);
                carrying = false;
                log("Move completed:");
                whose_turn = (whose_turn+1)%2;
            } else {
                alert("You can not drop here fucker...");
            }

        }

    });


});

function canDropHere(from, to, ktype, destination_ktype) {
    //dis  depends on the name celc_r_c
    //if u change it u r fucked
    //return true if r+c is odd..
    var sum_r_c = parseInt(to.charAt(5)) + parseInt(to.charAt(7));
    if (sum_r_c & 1 == 1) {return false;}

    //limiting back and forward motions
    var from_row = parseInt(from.charAt(5));
    var to_row = parseInt(to.charAt(5));
    var from_cell = parseInt(from.charAt(7));
    var to_cell = parseInt(to.charAt(7));

    if (from_cell==to_cell && from_row==to_row && ktype==destination_ktype){
        //rudisha kete ucheze tena
        removeKete(from);//to allow adding it again...
        whose_turn = (whose_turn+1)%2;//to stop the turn
        return true;
    }

    if (destination_ktype != -1){
        //if destination is not empty
        return false;
    }

    if (Math.abs(to_row - from_row) == 1) {
        //simple jump forward..
        if (ktype == 0  && from_row < to_row) {return true;}
        if (ktype == 1  && from_row > to_row) { return true; }
    }

    if (Math.abs(to_row - from_row) == 2) {
        //move ya kula..
        log("MOVE YA KULA");

        //intermediate coords
        var i_r = parseInt((from_row + to_row)/2);
        var i_c = parseInt((from_cell + to_cell)/2);
        var i_id = "cell_"+i_r+"_"+i_c;

        //intermediate kete id....
        var it = getKeteType(i_id);
        if(it != -1 && it != ktype) {
            log("Your good .. Eat..!");
            removeKete(i_id);
            return true;
        }
    }

    return false;
}

function hasKete(id) {
    return (document.getElementById(id).innerHTML.lastIndexOf("<i", 0) == 0);
}

function getKeteType(id){
    //returns -1 if box empty or 0|1 for other cases
    if (!hasKete(id)) { return -1; }
    if (document.getElementById(id).innerHTML.contains('1')){
        return 1;
    } else {
        return 0;
    }
}

function putKete(id, keteType) {
    document.getElementById(id).innerHTML = kete[keteType];
}

function removeKete(id) {
    document.getElementById(id).innerHTML = "";
}

function log(str) {
    $(".logbook").append("<br>"+str);
}

function fillKete() {

    var r, c;
    var cid;
    for (r=0; r<3; r++){
        for(c=r%2; c<8; c+=2) {
            cid = "cell_"+r+"_"+c;
            putKete(cid, 0);
        }
    }

    for (r=5; r<8; r++){
        for(c=r%2; c<8; c+=2) {
            cid = "cell_"+r+"_"+c;
            putKete(cid,1);
        }
    }
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var Point = function (id) {
    this.row = parseInt(id.charAt(5));
    this.cell= parseInt(id.charAt(7));
    this.isValid = function() {
        return ( (this.row + this.cell) & 1 == 0) ? true : false;
    };
    this.keteType = function() {
        return getKeteType(id);
    };
    this.getId = id;
    this.between = function(anotherId){
        var p = new Point(anotherId);
        var r = parseInt((this.row + p.row)/2);
        var c = parseInt((this.cell + p.cell)/2);
        return new Point("cell_"+r+"_"+c);
    };
}