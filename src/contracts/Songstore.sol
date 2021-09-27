pragma solidity ^0.5.0;

contract Songstore {
	uint public allSongsCounter = 0;
	mapping(uint => Song) public songs;

	struct Song {
		uint id;
		string title;
		string artist;
		string genre;
		uint priceDownloadLicense;
		uint priceCoverLicense;
		uint priceRegularLicense;
		uint priceExtendedLicense;
		address payable owner;
	}

	event SongCreated(
			uint id,
			string title,
			string artist,
			string genre,
			uint priceDownloadLicense,
			uint priceCoverLicense,
			uint priceRegularLicense,
			uint priceExtendedLicense,
			address payable owner
		); 

	event SongPurchased(
			uint id,
			string title,
			string artist,
			uint value,
			address payable owner
		); 


	function createSong(string memory _title, string memory _artist, string memory _genre, uint _priceDownloadLicense,
		uint _priceCoverLicense, uint _priceRegularLicense, uint _priceExtendedLicense) public {
		//Require a valid title and artist
		require(bytes(_title).length > 0);
		require(bytes(_artist).length > 0);
		require(bytes(_genre).length > 0);
		//Require a valid price
		require(_priceDownloadLicense > 0);
		require(_priceCoverLicense > 0);
		require(_priceRegularLicense > 0);
		require(_priceExtendedLicense > 0);

		//Increment allSongsCounter
		allSongsCounter ++;

		//Create the song
		songs[allSongsCounter] = Song(allSongsCounter, _title, _artist, _genre, _priceDownloadLicense, _priceCoverLicense, _priceRegularLicense, _priceExtendedLicense, msg.sender);
		// Trigger an event
		emit SongCreated(allSongsCounter, _title, _artist, _genre, _priceDownloadLicense,  _priceCoverLicense, _priceRegularLicense, _priceExtendedLicense, msg.sender);

	}

	function purchaseSong(uint _id) public payable {
		//Fetch the song
		Song memory _song = songs[_id];
		//Fetch the owner
		address payable _seller = _song.owner;

		//Make sure the song is valid - has a valid id)
		require (_song.id > 0 && _song.id <= allSongsCounter);
		//Require that the buyer is not the seller
		require(_seller != msg.sender);

		//Pay the seller by sending them Ether
		address(_seller).transfer(msg.value);

		//Trigger an event
		emit SongPurchased(_id, _song.title, _song.artist, msg.value, msg.sender);

	}
	
}

