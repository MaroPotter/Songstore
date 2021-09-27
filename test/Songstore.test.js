const Songstore = artifacts.require("Songstore") //fetching the contract abstraction

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Songstore', ([deployer, seller, buyer]) => { //the body for tests 
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
		it('has valid allSongsCounter', async () => {
			const allSongsCounter = await songstore.allSongsCounter()
			assert.equal(allSongsCounter, 0) // checks if allSongsCounter is initialized with 0
		})
	})

	describe('songs', async () => {
		let firstSong, allSongsCounter 

		before (async () => {
			firstSong = await songstore.createSong('Rok 1812', 'Piotr Czajkowski', 'Classical',
			  web3.utils.toWei('2', 'milliether'), web3.utils.toWei('2.5', 'milliether'),
			  web3.utils.toWei('4.50', 'milliether'), web3.utils.toWei('5.0', 'milliether'),{from: seller})
			await songstore.createSong('Eugeniusz Oniegin', 'Piotr Czajkowski', 'Classical',
			  web3.utils.toWei('3', 'milliether'), web3.utils.toWei('3.5', 'milliether'),
			  web3.utils.toWei('5.50', 'milliether'), web3.utils.toWei('6.0', 'milliether'),{from: seller})
			await songstore.createSong('The Entertainer', 'Scott Joplin', 'Jazz',
			  web3.utils.toWei('2', 'milliether'), web3.utils.toWei('2.5', 'milliether'),
			  web3.utils.toWei('4.50', 'milliether'), web3.utils.toWei('5.0', 'milliether'),{from: seller})
			allSongsCounter = await songstore.allSongsCounter()
		})

		it('creates songs', async () => {
			assert.equal(allSongsCounter, 3, 'allSongsCounter is correct')

			const event = firstSong.logs[0].args

			assert.equal(event.id.toNumber(), 1, 'id is correct')
			assert.equal(event.title, 'Rok 1812', 'title is correct')
			assert.equal(event.artist, 'Piotr Czajkowski', 'artist is correct')
			assert.equal(event.genre, 'Classical', 'genre is correct')
			assert.equal(event.priceDownloadLicense.toNumber(), 2000000000000000, 'priceOfLicenseDownloadLicense is correct') //2 mETh in Wei
			assert.equal(event.priceCoverLicense.toNumber(), 2500000000000000, 'priceOfLicenseCoverLicense is correct')
			assert.equal(event.priceRegularLicense.toNumber(), 4500000000000000, 'priceOfLicenseRegularLicense is correct')
			assert.equal(event.priceExtendedLicense.toNumber(), 5000000000000000, 'priceOfLicenseExtendedLicense is correct')
			assert.equal(event.owner, seller, 'owner is correct')

			//FAILURE: name of the song is missing
			await songstore.createSong('', 'Piotr Czajkowski', 'Classical',
			  web3.utils.toWei('2', 'milliether'), web3.utils.toWei('2.5', 'milliether'),
			  web3.utils.toWei('4.50', 'milliether'), web3.utils.toWei('5.0', 'milliether'),{from: seller}).should.be.rejected;
			//FAILURE: one of the priceOfLicenses for the song is missing
			await songstore.createSong('Dama pikowa', 'Piotr Czajkowski', 'Classical',
			  web3.utils.toWei('2', 'milliether'), web3.utils.toWei('2.5', 'milliether'),
			  web3.utils.toWei('4.50', 'milliether'),{from: seller}).should.be.rejected;
		})

		it('lists songs', async () => {
			console.log("List of the songs:")
			for(let i = 1; i <= allSongsCounter; i++) {

				const song = await songstore.songs(i)
				console.log(i + ". [" + song.title + ", " + song.artist + ", " + song.genre + "]")
			}


		})
		it('sells songs', async () => {
			//Track the seller balance before purchase
			let previousSellerAccountBalance
			previousSellerAccountBalance = await web3.eth.getBalance(seller)
			previousSellerAccountBalance = new web3.utils.BN(previousSellerAccountBalance)


			//SUCCESS: Buyer makes purchase
			let eventMain = await songstore.purchaseSong(1, {from: buyer, value: web3.utils.toWei('2', 'milliether')})
					
			//Check logs
			console.log(eventMain)		
			console.log(eventMain.logs)		
			const event = eventMain.logs[0].args
			assert.equal(event.id.toNumber(), 1, 'id is correct')
			assert.equal(event.title, 'Rok 1812', 'title is correct')
			assert.equal(event.artist, 'Piotr Czajkowski', 'artist is correct')
			assert.equal(event.value, '2000000000000000', 'value is correct')
			assert.equal(event.owner, buyer, 'owner is correct')

			//Check that seller received funds
			let newSellerAccountBalance
			newSellerAccountBalance = await web3.eth.getBalance(seller)
			newSellerAccountBalance = new web3.utils.BN(newSellerAccountBalance)

			let priceOfLicense
			priceOfLicense = web3.utils.toWei('2', 'milliether')
			priceOfLicense = new web3.utils.BN(priceOfLicense)

			const anticipatedSellerAccountBalance = previousSellerAccountBalance.add(priceOfLicense)
			assert.equal(newSellerAccountBalance.toString(), anticipatedSellerAccountBalance.toString())	

			//FAILURE: Buyer is trying to buy a song that does not exist, i.e. song doesn't have valid id
			await songstore.purchaseSong(99, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected

			//FAILURE: Buyer is trying to buy a song that belongs to him
			await songstore.purchaseSong(1, {from: seller, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected

		})

	})
})
