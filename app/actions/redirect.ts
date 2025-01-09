 'use server'
import { redirect } from "next/navigation";


export async function routeChange(route: string) {
    try {
        redirect(route);
    } catch (error) {
        console.error('Redirect failed:', error);
        throw new Error('NEXT_REDIRECT');
    }
}