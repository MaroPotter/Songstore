pragma solidity ^0.5.0;

contract Songstore {
	string public applicationTitle;
	uint public allSongsCounter = 0;
	mapping(uint => Song) public songs;

	struct Song {
		uint id;
		string title;
		string artist;
		string genre;
		uint priceDigitalDownload;
		uint priceCoverVersion;
		uint priceRegularLicense;
		uint priceExtendedLicense;
		address payable owner;
		bool purchased;
	}

	event SongCreated(
			uint id,
			string title,
			uint priceDigitalDownload,
			uint priceCoverVersion,
			uint priceRegularLicense,
			uint priceExtendedLicense,
			address payable owner,
			bool purchased
		); 

	event SongPurchased(
			uint id,
			string title,
			uint value,
			address payable owner,
			bool purchased
		); 

	constructor() public {
		applicationTitle = "Marek's songstore";
	}

	function createSong(string memory _title, string memory _artist, string memory _genre, uint _priceDigitalDownload,
		uint _priceCoverVersion, uint _priceRegularLicense, uint _priceExtendedLicense) public {
		//Make sure parameters are correct
		//Require a valid title and artist
		require(bytes(_title).length > 0);
		require(bytes(_artist).length > 0);
		require(bytes(_genre).length > 0);

		//Require a valid price
		require(_priceDigitalDownload > 0);
		require(_priceCoverVersion > 0);
		require(_priceRegularLicense > 0);
		require(_priceExtendedLicense > 0);
		//Increment allSongsCounter
		allSongsCounter ++;
		//Create the song
		songs[allSongsCounter] = Song(allSongsCounter, _title, _artist, _genre, _priceDigitalDownload, _priceCoverVersion, _priceRegularLicense, _priceExtendedLicense, msg.sender, false);
		// Trigger an event
		emit SongCreated(allSongsCounter, _title, _priceDigitalDownload,  _priceCoverVersion, _priceRegularLicense, _priceExtendedLicense, msg.sender, false);

	}

	function purchaseSong(uint _id) public payable {
		//Fetch the song
		Song memory _song = songs[_id];

		//Fetch the owner
		address payable _seller = _song.owner;
		//Make sure the song is valid - has a valid id)

		require (_song.id > 0 && _song.id <= allSongsCounter);
		//Require that the song has not been purchased already
		//require(!_song.purchased);
		//Require that the buyer is not the seller
		require(_seller != msg.sender);
		
		

		//Purchase it - transfer the ownership to the buyer
		_song.owner = msg.sender;
		//Mark as purchased
		_song.purchased = true;
		//Update the song
		songs[_id] = _song;
		//Pay the seller by sending them Ether
		address(_seller).transfer(msg.value);
		//Trigger an event
		emit SongPurchased(allSongsCounter, _song.title, msg.value, msg.sender, true);

	}
	
}

