import React, { useState } from 'react';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Calendar, Clock, Users, Plus, Send, CheckCircle, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
// Custom CSS for FullCalendar
const calendarStyles = `
  .fc .fc-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .fc .fc-button:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .fc .fc-button:not(:disabled).fc-button-active {
    background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .fc .fc-toolbar-title {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .fc .fc-daygrid-day:hover {
    background-color: rgba(102, 126, 234, 0.1);
  }

  .availability-event {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    border: none !important;
    color: white !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .meeting-event {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    border: none !important;
    color: white !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .request-event {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
    border: none !important;
    color: white !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  }

  .fc .fc-event {
    border-radius: 6px;
    padding: 2px 6px;
    font-size: 0.875rem;
  }

  .fc .fc-day-today {
    background-color: rgba(102, 126, 234, 0.1) !important;
  }
`;
interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  extendedProps?: {
    type: 'availability' | 'meeting' | 'request';
  };
}

export default function CalendarComponent() {
  const [events, setEvents] = useState<Event[]>([
    // Sample data
    {
      id: '1',
      title: 'Morning Availability',
      start: '2026-01-10T09:00:00',
      end: '2026-01-10T12:00:00',
      backgroundColor: '#10b981',
      extendedProps: { type: 'availability' }
    },
    {
      id: '2',
      title: 'Meeting with TechCorp Investors',
      start: '2026-01-15T14:00:00',
      end: '2026-01-15T15:30:00',
      backgroundColor: '#3b82f6',
      extendedProps: { type: 'meeting' }
    },
    {
      id: '3',
      title: 'Request: Product Demo with StartupXYZ',
      start: '2026-01-18T10:00:00',
      end: '2026-01-18T11:00:00',
      backgroundColor: '#f59e0b',
      extendedProps: { type: 'request' }
    },
    {
      id: '4',
      title: 'Afternoon Slots',
      start: '2026-01-20T13:00:00',
      end: '2026-01-20T17:00:00',
      backgroundColor: '#10b981',
      extendedProps: { type: 'availability' }
    }
  ]);

  const [showAddSlot, setShowAddSlot] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slotTitle, setSlotTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [showSendRequest, setShowSendRequest] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requestStartTime, setRequestStartTime] = useState('');
  const [requestEndTime, setRequestEndTime] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo.view.calendar;
    const currentView = selectInfo.view.type;

    if (currentView === 'dayGridMonth') {
      // Month view - select date, then show modal for time
      setSelectedDate(selectInfo.start);
      setShowAddSlot(true);
    } else {
      // Week/Day view - direct time range selection
      const startTime = selectInfo.start.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const endTime = selectInfo.end.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const newEvent: Event = {
        id: Date.now().toString(),
        title: 'Available Slot',
        start: selectInfo.start.toISOString(),
        end: selectInfo.end.toISOString(),
        backgroundColor: '#10b981',
        extendedProps: { type: 'availability' }
      };

      setEvents([...events, newEvent]);
      toast.success('Availability slot added!', {
        icon: <Plus className="w-5 h-5 text-green-500" />
      });

      calendarApi.unselect();
    }
  };

  const handleSendRequest = () => {
    if (requestTitle && requestDate && requestStartTime && requestEndTime && recipient) {
      const start = new Date(`${requestDate}T${requestStartTime}`);
      const end = new Date(`${requestDate}T${requestEndTime}`);

      const newEvent: Event = {
        id: Date.now().toString(),
        title: `Request: ${requestTitle} with ${recipient}`,
        start: start.toISOString(),
        end: end.toISOString(),
        backgroundColor: '#f59e0b',
        extendedProps: { type: 'request' }
      };

      setEvents([...events, newEvent]);
      setShowSendRequest(false);
      setRequestTitle('');
      setRequestDate('');
      setRequestStartTime('');
      setRequestEndTime('');
      setRecipient('');
      toast.success('Meeting request sent successfully!', {
        icon: <Send className="w-5 h-5 text-blue-500" />
      });
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleAddSlot = () => {
    if (selectedDate && startTime && endTime) {
      const start = new Date(selectedDate);
      const [startH, startM] = startTime.split(':');
      start.setHours(parseInt(startH), parseInt(startM));

      const end = new Date(selectedDate);
      const [endH, endM] = endTime.split(':');
      end.setHours(parseInt(endH), parseInt(endM));

      const newEvent: Event = {
        id: Date.now().toString(),
        title: slotTitle || 'Available Slot',
        start: start.toISOString(),
        end: end.toISOString(),
        backgroundColor: '#10b981',
        extendedProps: { type: 'availability' }
      };

      setEvents([...events, newEvent]);
      setShowAddSlot(false);
      setSlotTitle('');
      setStartTime('');
      setEndTime('');
      toast.success('Availability slot added!', {
        icon: <Plus className="w-5 h-5 text-green-500" />
      });
    } else {
      toast.error('Please select start and end times');
    }
  };

  const handleEventClick = (clickInfo: any) => {
    // Handle meeting requests with toast notifications
    if (clickInfo.event.extendedProps.type === 'request') {
      toast((t) => (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Meeting Request</span>
          </div>
          <p className="text-sm text-gray-600">{clickInfo.event.title}</p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => {
                // Convert to meeting
                const updatedEvents = events.map(event =>
                  event.id === clickInfo.event.id
                    ? { ...event, extendedProps: { type: 'meeting' }, backgroundColor: '#3b82f6', title: event.title.replace('Request: ', '') }
                    : event
                );
                setEvents(updatedEvents);
                toast.dismiss(t.id);
                toast.success('Meeting request accepted!', {
                  icon: <CheckCircle className="w-5 h-5 text-green-500" />
                });
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Decline - remove
                setEvents(events.filter(event => event.id !== clickInfo.event.id));
                toast.dismiss(t.id);
                toast.error('Meeting request declined', {
                  icon: <XCircle className="w-5 h-5 text-red-500" />
                });
              }}
            >
              Decline
            </Button>
          </div>
        </div>
      ), {
        duration: 10000,
        position: 'top-center'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calendar
          </h1>
        </div>
        <p className="text-gray-600 ml-14">Manage your availability and meetings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <FullCalendarComponent
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
              eventDisplay="block"
              eventClassNames={(arg) => {
                const type = arg.event.extendedProps.type;
                switch (type) {
                  case 'availability':
                    return 'availability-event';
                  case 'meeting':
                    return 'meeting-event';
                  case 'request':
                    return 'request-event';
                  default:
                    return '';
                }
              }}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3 mb-4">
              <Button 
                onClick={() => setShowAddSlot(true)} 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Availability Slot
              </Button>
              <Button 
                onClick={() => setShowSendRequest(true)} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                variant="outline"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Meeting Request
              </Button>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 Pro Tip:</p>
              <p>• Month view: Click date for detailed time selection</p>
              <p>• Week/Day view: Drag to select time ranges instantly</p>
            </div>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
            </div>
            <div className="space-y-3">
              {events.filter(event => event.extendedProps?.type === 'meeting').slice(0, 5).map(event => (
                <div key={event.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <p className="font-medium text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(event.start).toLocaleString()}
                  </p>
                </div>
              ))}
              {events.filter(event => event.extendedProps?.type === 'meeting').length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming meetings</p>
                </div>
              )}
            </div>
          </Card>

          {/* Legend */}
          <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Available Slots</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Confirmed Meetings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Pending Requests</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Add Availability Slot</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slot Title (Optional)</label>
                <Input
                  placeholder="e.g., Morning Session"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleAddSlot}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddSlot(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Send Request Modal */}
      {showSendRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Send Meeting Request</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                <Input
                  placeholder="e.g., Product Demo"
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <Input
                    type="time"
                    value={requestStartTime}
                    onChange={(e) => setRequestStartTime(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <Input
                    type="time"
                    value={requestEndTime}
                    onChange={(e) => setRequestEndTime(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <Input
                  placeholder="e.g., john@company.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleSendRequest}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSendRequest(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
