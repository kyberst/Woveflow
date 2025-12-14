import { ComponentTemplate } from '../../types';

export const WIDGET_COMPONENTS: ComponentTemplate[] = [
    { id: 'gmaps', name: 'Google Maps', category: 'widget', icon: 'map-pin', content: '<iframe width="100%" height="300" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4&key=YOUR_API_KEY"></iframe>' },
    { id: 'embed-vid', name: 'Embed Video', category: 'widget', icon: 'youtube', content: '<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>' },
    { id: 'chartjs', name: 'Chart JS', category: 'widget', icon: 'bar-chart', content: '<div class="builder-component-chart p-4 bg-white border rounded text-center text-gray-500">[Chart.js Placeholder]</div>' },
    { id: 'lottie', name: 'Lottie', category: 'widget', icon: 'film', content: '<div class="builder-component-lottie p-4 bg-gray-50 border rounded text-center">[Lottie Animation]</div>' },
    { id: 'paypal', name: 'PayPal', category: 'widget', icon: 'credit-card', content: '<button class="bg-blue-500 text-white px-6 py-2 rounded font-bold italic">PayPal <span class="font-normal text-xs">Checkout</span></button>' },
    { id: 'twitter', name: 'Twitter Feed', category: 'widget', icon: 'twitter', content: '<div class="p-4 border rounded bg-blue-50 text-blue-500">[Twitter Feed Embed]</div>' },
    { id: 'osm', name: 'Open Street Map', category: 'widget', icon: 'map', content: '<iframe width="100%" height="300" src="https://www.openstreetmap.org/export/embed.html"></iframe>' },
];