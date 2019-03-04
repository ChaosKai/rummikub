

    var peer = null;
    var conn = null;

    var player = {
        name : null
    }


    function connectToHost(hostId)
    {
        peer = new Peer();
        peer.on('open', function (id)
        {
            console.log("Client ID: " + id);
        });

        conn = peer.connect(hostId, {
            reliable: true
        });

        conn.on('open', function()
        {
            console.log("CONNECTED");
            conn.send({
                action : "Game:Global:PlayerConnected",
                name   : player.name
            });
        });

        conn.on('data', function (data)
        {
            console.log(data.action);
            if( data.action == "Game:Global:PoolTable" )
            {
                renderPoolTable(data.tiles);
            }

            if( data.action == "Game:Global:GameTable" )
            {
                renderGameTable(data.tiles);
            }

            if( data.action == "Game:Global:PlayerNames" )
            {
                console.log(data.players);
                renderPlayerList(data.players);
            }

            if( data.action == "Game:Global:SendPlayerName" )
            {
                console.log("Send Player Name");
                conn.send({
                    action : "Game:Global:PlayerName",
                    name   : player.name
                });
            }

            if( data.action == "Game:Board:BoardTiles" )
            {
                if( player.name == data.player )
                {
                    Board.width  = data.width;
                    Board.height = data.height;
                    Board.tiles  = data.tiles;
                    updateBoard();
                }
            }
        });

        conn.on('close', function ()
        {
            console.log("Connection closed");
        });
    }




    function renderPlayerList(playerList)
    {
        $("#player-list").empty();

        var playerElement = $(`<header>${player.name}</header>`);
        $("#player-list").append(playerElement);

        for (var i = 0; i < playerList.length; i++)
        {
            var playerElement = $(`<span>${playerList[i]}</span>`);
            $("#player-list").append(playerElement);
        }
    }
