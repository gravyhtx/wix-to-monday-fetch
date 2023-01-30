import wixLocation from 'wix-location';
import mondaySdk from 'monday-sdk-js'; // Make sure to install "monday-sdk-js"
const monday = mondaySdk();

// This code will add a user's email to Monday with a label
// Added code to send the data to an external API as well that grabs results from the query
// A client needed that so maybe you will too...
export function register_click(event) { // This is attached to the form submit button 
	//Add your code for this event here: 
	if ($w("#formEmail").validity.valid === true) {
		const boardId = '626217679' // Use your own!
		const mutation = `mutation ( $email: String!, $columnVals: JSON! ) { create_item (board_id:${boardId}, item_name:$email, column_values:$columnVals ) { id } }`;
		const customerEmail = $w("#formEmail").value;
		const newCustomer = {
			"email": customerEmail, // Add 'email'
			"columnVals" : JSON.stringify({ // Label it as incomplete
    			"status" : {"label" : "Incomplete"}
			})
		}

		// EXTERNAL URL
		const externalUrl = `https://app.yoursite.com/register/?userEmail=${customerEmail}`;

		try {
			fetch('https://api.monday.com/v2/', {

				'method': 'POST',
				'headers': {
					'Content-Type': 'application/json',
					'Authorization': "YOUR_API_KEY"
				},
				'body': JSON.stringify({
					'variables' : JSON.stringify(newCustomer),
					'query': mutation,
					})
				})
				.then(res => res.json())
				.then(res => {
					const ownersRes = res.data.create_item.id
					// If you want it to open to your new app
					wixLocation.to(externalUrl + "&userId=" + ownersRes)
				})
		} catch(err) {
			throw new Error(err)
			// OR you can send em somewhere else or whatever ya wana do.
			// wixLocation.to(externalUrl)
		}
	}
}
