import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {getByLabelText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const header = screen.getByText(/Contact Form/i)
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)
    
    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "Bob");

    const errorMessage = await screen.queryAllByTestId('error');
    expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId('error')
        expect(errorMessages).toHaveLength(3);
    });    
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)

    const firstName = screen.getByLabelText(/First Name*/i);
    const lastName = screen.getByLabelText(/Last Name*/i);
    const email = screen.getByLabelText(/Email*/i);
    const submitButton = screen.getByRole("button");
    
    userEvent.type(firstName, "Robert")
    userEvent.type(lastName, "Stott")
    userEvent.type(email, " ")
    userEvent.click(submitButton);
    

    const errorMessage =  await screen.queryAllByTestId('error');
    expect(errorMessage).toHaveLength(1); 
  
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)
    
    const email = screen.getByLabelText(/Email*/i);
    userEvent.type(email, "tits")

    const errorMessage =  await screen.getByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)
    const lastName = screen.getByLabelText(/Last Name*/i);
    const submitButton = screen.getByRole("button");

    userEvent.type(lastName, "");
    userEvent.click(submitButton);

    const errorMessage = await screen.getByText(/LastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)

    const firstName = screen.getByLabelText(/First Name*/i);
    const lastName = screen.getByLabelText(/Last Name*/i);
    const email = screen.getByLabelText(/Email*/i);
    const submitButton = screen.getByRole("button");

    userEvent.type(firstName, "Robert")
    userEvent.type(lastName, "Stott")
    userEvent.type(email, "hung-man@aol.com")
    userEvent.click(submitButton);

    await waitFor (()=>{
        const firstNameDisplay = screen.queryByText("Robert");
        const lastNameDisplay = screen.queryByText("Stott");
        const emailNameDisplay = screen.queryByText("hung-man@aol.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailNameDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })


});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)

    const firstName = screen.getByLabelText(/First Name*/i);
    const lastName = screen.getByLabelText(/Last Name*/i);
    const email = screen.getByLabelText(/Email*/i);
    const message = screen.getByLabelText(/Message/i)
    const submitButton = screen.getByRole("button");

    userEvent.type(firstName, "Robert")
    userEvent.type(lastName, "Stott")
    userEvent.type(email, "hung-man@aol.com")
    userEvent.type(message, "HEYYYY")
    userEvent.click(submitButton);

    await waitFor (()=>{
        const firstNameDisplay = screen.queryByText("Robert");
        const lastNameDisplay = screen.queryByText("Stott");
        const emailNameDisplay = screen.queryByText("hung-man@aol.com");
        const messageDisplay = screen.queryByText("HEYYYY");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailNameDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })

});