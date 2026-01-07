class User {
    def __init__(self, username, password, user_id, wallet_address) {
        self.username = username
        self.password = password
        self.user_id = user_id
        self.wallet_address = wallet_address
        self.tickets_owned = []
    }

    def __str__(self) {
        return f"User: {username}, Wallet Address: {wallet_address}, Tickets Owned: {tickets_owned}"
    }

    def add_ticket(ticket_id) {
        if ticket_id in tickets_owned:
            raise ValueError(f"Ticket {ticket_id} is already owned by this user.")
        self.tickets_owned.append(ticket_id)
    }
}