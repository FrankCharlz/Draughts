
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
    var images = new Array();

    images[0] = new Image();
    images[0].src = "img/kete1.png";

    images[1] = new Image();
    images[1].src = "img/kete2.png";

    makeBoard();

    var logbook = $(".logbook");

    $(".row:nth-child(1) > .cell:nth-child(odd)").append(images[1]);
    $(".row:nth-child(2) > .cell:nth-child(even)").append(images[1]);
    $(".row:nth-child(3) > .cell:nth-child(odd)").append(images[1]);

    //stupid non selected
    //$(".row:nth-child(1) > .cell:nth-child(4)").append(images[1]);
    //$(".row:nth-child(2) > .cell:nth-child(8)").append(images[1]);

    $(".row:nth-child(6) > .cell:nth-child(even)").append(images[0]);
    $(".row:nth-child(7) > .cell:nth-child(odd)").append(images[0]);
    $(".row:nth-child(8) > .cell:nth-child(even)").append(images[0]);

    var carrying = false;
    var from;

    $(".cell").click(function() {
        var id =  $(this).attr('id');
        var kete_str =  $("#"+id+" > img").attr('src')+"";
        var kete_type = (kete_str.contains('2')) ? 0 : 1;


        if (!carrying) {
            carrying = true;
            from = id;
        }
        else {
            $("#"+from).empty();
            $("#"+id).append(images[kete_type]);
            carrying = false;
        }
        
        logbook.text("Clicked : "+id);

    });



});


String.prototype.contains = function(it) { return this.indexOf(it) != -1; };


