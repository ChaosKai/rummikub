
    var Board = {
        width  : 15,
        height : 3,
        tiles  : []
    };

    var BoardTileWidth  = 40;
    var BoardTileHeight = 60;

    var SelectedTiles = [];


    function updateBoard()
    {
        $("#board").css("width", Board.width * BoardTileWidth);
        $("#board").css("height", Board.height * BoardTileHeight + 44);

        $("#tile-rows").empty();
        $("#tile-rows").css("height", Board.height * BoardTileHeight);

        for (var row = 1; row <= Board.height; row++)
        {
            var tileRow = $(`<div class="tile-row" data-row="${row}"></div>`);
            tileRow.css("height", BoardTileHeight);

            for (var col = 1; col <= Board.width; col++)
            {
                var foundTileIndex = -1;

                for (var tileIndex = 0; tileIndex < Board.tiles.length; tileIndex++)
                {
                    if( Board.tiles[tileIndex].row == row && Board.tiles[tileIndex].col == col )
                    {
                        foundTileIndex = tileIndex;
                    }
                }

                var tile = $(`<a data-row="${row}" data-col="${col}" data-selected="false"></a>`);
                tile.css({
                    width  : BoardTileWidth,
                    height : BoardTileHeight - 4
                });

                if( foundTileIndex > -1 )
                {
                    tile.css("color", Board.tiles[foundTileIndex].color);
                    tile.attr("data-index", foundTileIndex);
                    tile.attr("data-type", "tile");
                    tile.on("click", function()
                    {
                        conn.send({
                            action : "Game:Board:SelectTile",
                            player : player.name,
                            index  : $(this).attr("data-index"),
                        });
                    });
                    tile.append(`<span>${Board.tiles[foundTileIndex].value}</span>`);

                    if( Board.tiles[foundTileIndex].selected )
                    {
                        tile.attr("data-selected", true);
                    }
                }
                else
                {
                    tile.attr("data-type", "none");
                    tile.on("click", function()
                    {
                        pasteBoardTile($(this).attr("data-row"), $(this).attr("data-col"))
                    });
                }

                tileRow.append(tile);
            }

            $("#tile-rows").append(tileRow);
        }
    }


    $(document).ready( function()
    {
        updateBoard();

        $("#button-add-tile-row").on("click", function()
        {
            conn.send({
                action : "Game:Board:AddRow",
                player : player.name
            });
        });

        $("#button-del-tile-row").on("click", function()
        {
            conn.send({
                action : "Game:Board:RemoveRow",
                player : player.name
            });
        });
    });


    function pasteBoardTile(row, col)
    {
        if( SelectedTiles.length != 1 )
            return;

        BoardTiles[`${row}-${col}`].value = SelectedTiles[0].value;
        BoardTiles[`${SelectedTiles[0].row}-${SelectedTiles[0].col}`].value = null;
        SelectedTiles = [];

        updateBoard();
    }

    function getSelectedTilesFromBoard()
    {
        var selectedTiles = [];

        for(var tileIndex = 0; tileIndex < Game.boards[boardIndex].tiles.length; tileIndex++)
        {
            if( Board.tiles[tileIndex].selected )
            {
                selectedTiles.push(Board.tiles[tileIndex]);
            }
        }

        return selectedTiles;
    }
