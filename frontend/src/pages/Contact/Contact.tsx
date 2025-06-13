
const Contact = () => {

    return (
        <div>
            <h1 className="text-2xl font-bold">Contact</h1>
            <div className="flex flex-col gap-4 center mf-3">
                <p>Email: contact@salon.com</p>
                <p>Phone: 123-456-7890</p>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Ojcowie założyciele</h2>
                <img src="public/images/ojcowie.jpg" alt="Ojcowie założyciele" style={{ width: '50%', height: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }} />
            </div>
        </div>
    )
}

export default Contact;