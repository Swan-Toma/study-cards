import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

/*
 *  Component to display study cards with next and right buttons
 *  and a counter to display progress.
 */
class Slide extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: [null],
			selectedCards: [null],
			categories: [null],
			cardsAreLoaded: false,
			categoriesAreLoaded: false,
			index: 0,
			cardsLength: 0,
			options: [null]
		};
		// Bind this argument to these functions
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.toggle = this.toggle.bind(this);
		this.loadStudyCards = this.loadStudyCards.bind(this);
	}

	retrieveCategories() {
		// GET API call to retreieve all categories
		fetch("http://localhost:3001/api/v1/categories").then((response) => {
			return response.json();
		}).then((categoryList) => {
			let cats = [];
			for (let i = 0; i < categoryList.length; ++i) {
				cats.push(categoryList[i].category);
			}
			const options = cats.map((elem) => {
				// key satisfies warning:
				// 'Warning: Each child in a list should have a unique "key" prop.'
				return <option key={elem}>{elem}</option>;
			});
			this.setState({ options: options })
			this.setState({ categories: cats, categoriesAreLoaded: true })
		}).catch((error) => {
			console.log(error);
		});
	}

	retrieveCards() {
		// GET API call to retreieve all study cards
		fetch("http://localhost:3001/api/v1/cards").then((response) => {
			return response.json();
		}).then((cardList) => {
			this.setState({ cards: cardList, selectedCards: cardList, cardLength: cardList.length, cardsAreLoaded: true })
		}).catch((error) => {
			console.log(error);
		});
	}

	componentDidMount() {
		this.retrieveCategories();
		this.retrieveCards();
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

	// Select study cards by category
	loadStudyCards() {
		if (document.getElementById("cardsSelection")) {
			let option = document.getElementById("cardsSelection").value;

			if (option === "All cards") {
				this.setState({ selectedCards: this.state.cards, cardLength: this.state.cards.length, index: 0 });
			}
			else {
				const selectedCards = this.state.cards.filter((elem) => {
					if (elem.category === option) {
						return elem;
					}
					return false;
				});
				this.setState({ selectedCards: selectedCards, cardLength: selectedCards.length, index: 0 });
			}
		}
	}

	render() {
		const { selectedCards, cardsAreLoaded, index, categoriesAreLoaded, options } = this.state;

		if (cardsAreLoaded && categoriesAreLoaded) {
			return (
				<div>
					<div className="select-wrapper">
						<select name="cardsSelection" id="cardsSelection" onChange={this.loadStudyCards}>
							<option>All cards</option>
							{options}
						</select>
					</div>

					<div className="scene">
						<div><button className="prev" onClick={this.prev}>&#8249;</button></div>
						{/* Study card container */}
						<div className="container card" onClick={this.toggle}>
							{/* Front of study card */}
							<div className="slide card__face">
								<p>{selectedCards[index]['concept']}</p>
							</div>
							{/* Back of study card */}
							<div className="slide card__face card__face--back">
								<p>{selectedCards[index]['definition']}</p>
							</div>
						</div>
						<div><button className="next" onClick={this.next}>&#8250;</button></div>
					</div >
					<p id="counter" className="container">{this.state.index + 1} / {this.state.cardLength}</p>
				</div >
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