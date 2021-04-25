import React, { Component } from 'react';

class Main extends Component {



    render() {

    return (
      <div id="content">
      <div className="add-song-wrapper">
        <h1>Add Song</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const title = this.songTitle.value
          const artist = this.songArtist.value
          const genre = this.songGenre.value
          const priceDigitalDownload = window.web3.utils.toWei(this.priceDigitalDownload.value.toString(), 'milliether')
          const priceCoverVersion = window.web3.utils.toWei(this.priceCoverVersion.value.toString(), 'milliether')
          const priceRegularLicense = window.web3.utils.toWei(this.priceRegularLicense.value.toString(), 'milliether')
          const priceExtendedLicense= window.web3.utils.toWei(this.priceExtendedLicense.value.toString(), 'milliether')

          this.props.createSong(title, artist, genre, priceDigitalDownload, priceCoverVersion, priceRegularLicense, priceExtendedLicense)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="songTitle"
              type="text"
              ref={(input) => { this.songTitle = input }}
              className="form-control"
              placeholder="Song's title"
              required />
          </div>
        <div className="form-group mr-sm-2">
          <input
              id="songArtist"
              type="text"
              ref={(input) => { this.songArtist = input }}
              className="form-control"
              placeholder="Name of the artist / band"
              required />
        </div>
          <div className="form-group mr-sm-2">
            <input
                id="songGenre"
                type="text"
                ref={(input) => { this.songGenre = input }}
                className="form-control"
                placeholder="Genre to which it belongs"
                required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceDigitalDownload"
              type="text"
              ref={(input) => { this.priceDigitalDownload = input }}
              className="form-control"
              placeholder="Price for Digital Download license (in milliethers)"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceCoverVersion"
              type="text"
              ref={(input) => { this.priceCoverVersion = input }}
              className="form-control"
              placeholder="Price for Cover Version license (in milliethers)"
              required />
           </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceRegularLicense"
              type="text"
              ref={(input) => { this.priceRegularLicense = input }}
              className="form-control"
              placeholder="Price for Regular License (in milliethers)"
              required />
           </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceExtendedLicense"
              type="text"
              ref={(input) => { this.priceExtendedLicense = input }}
              className="form-control"
              placeholder="Price for Extended License (in milliethers)"
              required />
          </div>
          <button type="submit" className="btn btn-primary button" >Add Song</button>

        </form>
      </div>
        <p>&nbsp;</p>
      <div className="buy-song-wrapper">
        <h1 className="h1h1">Buy Song</h1>
        <table className="content-table">
          <thead>
            <tr>
              <th scope="col" >#</th>
              <th scope="col">Title</th>
              <th scope="col">Artist</th>
              <th scope="col">Genre</th>
              <th scope="col" className="smaller-col">Digital Download (mETH)</th>
              <th scope="col" className="smaller-col">Cover Version (mETH)</th>
              <th scope="col" className="smaller-col">Regular License (mETH)</th>
              <th scope="col" className="smaller-col">Extended License (mETH)</th>
              <th scope="col">Owner</th>
              <th scope="col" className="medium-col">Selection of license</th>
            </tr>
          </thead>
          <tbody id="songList">
            { this.props.songs.map((song, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{song.id.toString()}</th>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.genre}</td>
                  <td className="smaller-col">{parseFloat(window.web3.utils.fromWei(song.priceDigitalDownload.toString(),
                      'milliether')).toFixed(2)}</td>
                  <td className="smaller-col">{parseFloat(window.web3.utils.fromWei(song.priceCoverVersion.toString(),
                      'milliether')).toFixed(2)}</td>
                  <td className="smaller-col">{parseFloat(window.web3.utils.fromWei(song.priceRegularLicense.toString(),
                      'milliether')).toFixed(2)}</td>
                  <td className="smaller-col">{parseFloat(window.web3.utils.fromWei(song.priceExtendedLicense.toString(),
                      'milliether')).toFixed(2)}</td>
                  <td className="owner">{song.owner}</td>

                  <td><select onChange={(event) => this.props.onSelectChange(event.target.value, song)}
                              value={song.selectedValue}>

                        <option value="priceDigitalDownload">Digital Download</option>
                        <option value="priceCoverVersion">Cover Version</option>
                        <option value="priceRegularLicense">Regular License</option>
                        <option value="priceExtendedLicense">Extended License</option>

                      </select>


                    { (song.owner === this.props.account)
                      ? null
                      : <button name={song.id} className="button-2 btn btn-primary"

                                onClick={(event) => {
                                  this.props.purchaseSong(song.id)
                                }}
                        >
                          Buy
                        </button>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}

export default Main;