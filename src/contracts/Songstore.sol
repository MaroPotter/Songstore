pragma solidity ^0.5.0;

contract Songstore {
	string public name;
	uint public productCount = 0;
	mapping(uint => Product) public products;

	struct Product {
		uint id;
		string name;
		uint priceDigitalDownload;
		uint priceCoverVersion;
		uint priceRegularLicense;
		uint priceExtendedLicense;
		address payable owner;
		bool purchased;
	}

	event ProductCreated(
			uint id,
			string name,
			uint priceDigitalDownload,
			uint priceCoverVersion,
			uint priceRegularLicense,
			uint priceExtendedLicense,
			address payable owner,
			bool purchased
		); 

	event ProductPurchased(
			uint id,
			string name,
			uint priceDigitalDownload,
			uint priceCoverVersion,
			uint priceRegularLicense,
			uint priceExtendedLicense,
			address payable owner,
			bool purchased
		); 

	constructor() public {
		name = "Marek's songstore";
	}

	function createProduct(string memory _name, uint _priceDigitalDownload, uint _priceCoverVersion, uint _priceRegularLicense, uint _priceExtendedLicense) public {
		//Make sure parameters are correct
		//Require a valid name
		require(bytes(_name).length > 0);
		//Require a valid price
		require(_priceDigitalDownload > 0);
		require(_priceCoverVersion > 0);
		require(_priceRegularLicense > 0);
		require(_priceExtendedLicense > 0);
		//Increment productCont
		productCount ++;
		//Create the product
		products[productCount] = Product(productCount, _name, _priceDigitalDownload, _priceCoverVersion, _priceRegularLicense, _priceExtendedLicense, msg.sender, false);
		// Trigger an event
		emit ProductCreated(productCount, _name, _priceDigitalDownload,  _priceCoverVersion, _priceRegularLicense, _priceExtendedLicense, msg.sender, false);

	}

	function purchaseProduct(uint _id) public payable {
		//Fetch the product
		Product memory _product = products[_id];

		//Fetch the owner
		address payable _seller = _product.owner;
		//Make sure the product is valid - has a valid id)

		require (_product.id > 0 && _product.id <= productCount);
		//Require that there's enough Ether in the transaction
		// require (msg.value >= _mySelectedValue);
		//Require that the product has not been purchased already
		require(!_product.purchased);
		//Require that the buyer is not the seller
		require(_seller != msg.sender);
		
		

		//Purchase it - transfer the ownership to the buyer
		_product.owner = msg.sender;
		//Mark as purchased
		_product.purchased = true;
		//Update the product
		products[_id] = _product; 
		//Pay the seller by sending them Ether
		address(_seller).transfer(msg.value);
		//Trigger an event
		emit ProductPurchased(productCount, _product.name, _product.priceDigitalDownload, _product.priceCoverVersion, _product.priceRegularLicense, _product.priceExtendedLicense, msg.sender, true);

	}
	
}

