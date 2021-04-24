const Songstore = artifacts.require("./Songstore.sol")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Songstore', ([deployer, seller, buyer]) => {
	let songstore

	before (async () => {
		songstore = await Songstore.deployed()
	})

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await songstore.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)

		} )
		it('has a name', async () => {
			const name = await songstore.name()
			assert.equal(name, 'Marek\'s songstore')
		})
	})

	describe('products', async () => {
		let result, productCount

		before (async () => {
			result = await songstore.createProduct('Jezioro łabędzia', web3.utils.toWei('1', 'Ether'), {from: seller})
			productCount = await songstore.productCount()
		})

		it('creates products', async () => {
			//SUCCESS
			assert.equal(productCount, 1)
			console.log(result.logs)
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, 'Jezioro łabędzia', 'name is correct')
			assert.equal(event.price, '1000000000000000000', 'price is correct')
			assert.equal(event.owner, seller, 'owner is correct')
			assert.equal(event.purchased, false, 'purchased is correct')

			//FAILURE: Product must have a name
			await songstore.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;
			//FAILURE: Product must have a price
			await songstore.createProduct('Jezioro łabędzia', 0, {from: seller}).should.be.rejected;
		})

		it('lists products', async () => {
			const product = await songstore.products(productCount)
			assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(product.name, 'Jezioro łabędzia', 'name is correct')
			assert.equal(product.price, '1000000000000000000', 'price is correct')
			assert.equal(product.owner, seller, 'owner is correct')
			assert.equal(product.purchased, false, 'purchased is correct')

		})
		it('sells products', async () => {
			//Track the seller balance before purchase
			let oldSellerBalance
			oldSellerBalance = await web3.eth.getBalance(seller)
			oldSellerBalance = new web3.utils.BN(oldSellerBalance)


			//SUCCESS: Buyer makes purchase
			result = await songstore.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
					
			//Check logs		
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, 'Jezioro łabędzia', 'name is correct')
			assert.equal(event.price, '1000000000000000000', 'price is correct')
			assert.equal(event.owner, buyer, 'owner is correct')
			assert.equal(event.purchased, true, 'purchased is correct')

			//Check that seller received funds
			let newSellerBalance
			newSellerBalance = await web3.eth.getBalance(seller)
			newSellerBalance = new web3.utils.BN(newSellerBalance)

			let price
			price = web3.utils.toWei('1', 'Ether')
			price = new web3.utils.BN(price)

			const expectedBalance = oldSellerBalance.add(price)
			assert.equal(newSellerBalance.toString(), expectedBalance.toString())	

			//FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
			await songstore.purchaseProduct(99, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
			await songstore.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected
			await songstore.purchaseProduct(productCount, {from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
			await songstore.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected



		})

	})
})
