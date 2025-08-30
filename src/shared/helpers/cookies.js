'use server';

import { cookies } from 'next/headers';

// Function to create a cookie
async function createCookie(value) {
  cookies().set({
    name: 'currentUser',
    value: value,
    httpOnly: true,
    path: '/',
    maxAge: 31536000,
  });
}

// Function to delete a cookie
async function deleteCookie() {
  cookies().delete('currentUser');
}

export { createCookie, deleteCookie };
