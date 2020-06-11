import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

/*
 *  Component to display a study card with next and right buttons
 *  and a counter to display progress.
 */
class Slide extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: [null],
			cardsLength: 0,
			isLoaded: false,
			index: 0
		};
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	componentDidMount() {
		// GET API call to retreieve all study cards
		fetch("http://localhost:3001/api/v1/cards").then((response) => {
			return response.json();
		}).then((cardList) => {
			this.setState({ cards: cardList, cardLength: cardList.length, isLoaded: true })
		}).catch((error) => {
			console.log(error);
		});
	}

	// Go to previous study card
	prev() {
		const index = this.state.index;

		if (index === 0) {
			this.setState({ index: 0 });
		}
		else {
			this.setState({ index: index - 1 });
		}
	}

	// Go to next study card
	next() {
		const index = this.state.index;
		const last = this.state.cardLength - 1;

		if (index === last) {
			this.setState({ index: last });
		}
		else {
			this.setState({ index: index + 1 });
		}
	}

	// Flip a study card
	toggle() {
		const card = document.querySelector(".card");
		card.classList.toggle('is-flipped');
	}

	render() {
		const { cards, isLoaded, index, } = this.state;

		if (isLoaded) {
			return (
				<div>
					<div className="scene">
						<div><button className="prev" onClick={this.prev}>&#8249;</button></div>
						{/* Study card container */}
						<div className="container card" onClick={this.toggle}>
							{/* Front of study card */}
							<div className="slide card__face">
								<p>{cards[index]['concept']}</p>
							</div>
							{/* Back of study card */}
							<div className="slide card__face card__face--back">
								<p>{cards[index]['definition']}</p>
							</div>
						</div>
						<div><button className="next" onClick={this.next}>&#8250;</button></div>
					</div >
					<p id="counter" className="container">{this.state.index + 1} / {this.state.cardLength}</p>
				</div>
			);
		}
		else {
			return (
				<div className="container" >
					<div className="slide"><p></p></div>
				</div>
			);
		}
	}
}


// Display Slide component in root component
ReactDOM.render(<Slide />, document.querySelector("#root"));