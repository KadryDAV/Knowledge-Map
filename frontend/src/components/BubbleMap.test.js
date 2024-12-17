import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MapContext } from '../context/MapContext';
import BubbleMap from './BubbleMap';
import api from '../api/api';

jest.mock('../api/api');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ mapId: '1' }),
}));

const mockBubbles = [
    { id: '1', text: 'Bubble 1', x: 100, y: 100 },
    { id: '2', text: 'Bubble 2', x: 200, y: 200 },
];

const mockConnections = [
    { source: '1', target: '2', id: '1-2' },
];

const renderComponent = (isEditing, mapData) => {
    return render(
        <Router>
            <MapContext.Provider value={{
                bubbles: mockBubbles,
                setBubbles: jest.fn(),
                connections: mockConnections,
                setConnections: jest.fn(),
            }}>
                <BubbleMap isEditing={isEditing} mapData={mapData} />
            </MapContext.Provider>
        </Router>
    );
};

describe('BubbleMap', () => {
    it('renders loading state initially', () => {
        renderComponent(false, null);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders bubbles and connections', async () => {
        api.get.mockResolvedValue({ data: { bubbles: mockBubbles, connections: mockConnections } });
        renderComponent(false, null);

        await waitFor(() => {
            expect(screen.getByText('Bubble 1')).toBeInTheDocument();
            expect(screen.getByText('Bubble 2')).toBeInTheDocument();
        });
    });

    it('handles ellipse click for viewing topic details', async () => {
        api.get.mockResolvedValue({ data: { bubbles: mockBubbles, connections: mockConnections } });
        renderComponent(false, null);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Bubble 1'));
            expect(mockNavigate).toHaveBeenCalledWith('/topic-details/1/1');
        });
    });

    it('handles ellipse click for editing topic', async () => {
        api.get.mockResolvedValue({ data: { bubbles: mockBubbles, connections: mockConnections } });
        renderComponent(true, null);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Bubble 1'));
            expect(mockNavigate).toHaveBeenCalledWith('/add-topic/1/1');
        });
    });

    it('adds a new bubble', async () => {
        const setBubbles = jest.fn();
        const setConnections = jest.fn();
        render(
            <Router>
                <MapContext.Provider value={{
                    bubbles: mockBubbles,
                    setBubbles,
                    connections: mockConnections,
                    setConnections,
                }}>
                    <BubbleMap isEditing={true} mapData={null} />
                </MapContext.Provider>
            </Router>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByText('Add Bubble'));
            expect(setBubbles).toHaveBeenCalled();
            expect(setConnections).toHaveBeenCalled();
        });
    });

    it('removes a bubble', async () => {
        window.confirm = jest.fn().mockImplementation(() => true);
        const setBubbles = jest.fn();
        const setConnections = jest.fn();
        render(
            <Router>
                <MapContext.Provider value={{
                    bubbles: mockBubbles,
                    setBubbles,
                    connections: mockConnections,
                    setConnections,
                }}>
                    <BubbleMap isEditing={true} mapData={null} />
                </MapContext.Provider>
            </Router>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByTitle('Remove Bubble'));
            expect(setBubbles).toHaveBeenCalled();
            expect(setConnections).toHaveBeenCalled();
        });
    });
});