

    var Table = {
        poolTiles  : [],
        tableTiles : []
    }


    $(document).ready( function()
    {
        $("#game-table").on("click", function()
        {
            moveTilesFromBoardToTable();
        });

        $(document).on("mousemove", function(event)
        {
            mousePos.x = event.pageX;
            mousePos.y = event.pageY;

            if( movingGameTile == null )
                return;

            movingGameTile.element.css({
                top  : movingGameTile.origY + (mousePos.y - movingGameTile.mouse.startY),
                left : movingGameTile.origX + (mousePos.x - movingGameTile.mouse.startX)
            })
        });
    });





    function renderPoolTable(tileList)
    {
        $("#pool-table").empty();

        for (var i = 0; i < tileList.length; i++)
        {
            var tile = $(`<a></a>`);
            tile.attr("data-index", i);
            tile.css({
                left      : `${tileList[i].posX}px`,
                top       : `${tileList[i].posY}px`,
                transform : `translate(-50%, -50%) rotate(${tileList[i].rotat}deg)`,
                color     : `${tileList[i].color}`,
            });
            $("#pool-table").append(tile);

            tile.on("click", function()
            {
                conn.send({
                    action : "Game:Tile:MoveTileFromPoolToBoard",
                    index  : $(this).attr("data-index"),
                    player : player.name
                });
            });
        }
    }

    var mousePos = {
        x : 0,
        y : 0
    }

    var movingGameTile = null;

    function renderGameTable(tileList)
    {
        $("#game-table").empty();

        for (var i = 0; i < tileList.length; i++)
        {
            var tile = $(`<a>${tileList[i].value}</a>`);
            tile.attr("data-index", i);
            tile.attr("data-posx", tileList[i].posX);
            tile.attr("data-posy", tileList[i].posY);
            tile.css({
                left      : `${tileList[i].posX}px`,
                top       : `${tileList[i].posY}px`,
                transform : `translate(-50%, -50%)`,
                color     : `${tileList[i].color}`,
            });
            $("#game-table").append(tile);

            tile.on("mousedown", function(event)
            {
                movingGameTile = {
                    index   : parseInt( $(this).attr("data-index") ),
                    origX   : parseInt( $(this).attr("data-posx") ),
                    origY   : parseInt( $(this).attr("data-posy") ),
                    element : $(this),
                    mouse   : {
                        startX : mousePos.x,
                        startY : mousePos.y
                    },
                    pickup  : true
                }

                setTimeout(function()
                {
                    if( movingGameTile != null )
                    {
                        movingGameTile.pickup = false;
                    }
                }, 100)
            });

            tile.on("mouseup", function(event)
            {
                if( movingGameTile.pickup )
                {
                    conn.send({
                        action : "Game:Tile:moveTileFromTableToBoard",
                        index  : movingGameTile.index,
                        player : player.name
                    });
                }
                else
                {
                    conn.send({
                        action : "Game:Tile:SetNewTilePosition",
                        index  : movingGameTile.index,
                        posx   : movingGameTile.origX + (mousePos.x - movingGameTile.mouse.startX),
                        posy   : movingGameTile.origY + (mousePos.y - movingGameTile.mouse.startY),
                    });
                }

                movingGameTile = null;
            });
        }
    }




    function moveTilesFromBoardToTable()
    {
        conn.send({
            action : "Game:Tile:MoveTileFromBoardToTable",
            player : player.name
        });
    }
