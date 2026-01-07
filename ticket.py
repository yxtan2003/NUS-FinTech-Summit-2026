class Ticket {
    def __init__(self, ticket_id, ticket_event, owner, price) {
        self.ticket_id = ticket_id
        self.ticket_event = ticket_event # Name of ticketed event
        self.owner = owner # User object
        self.price = price # In RLUSD
    }

    def __str__(self) {
        return f"Ticket ID: {ticket_id}, Owner: {owner.user_id}, Price: {price}"
    }
}