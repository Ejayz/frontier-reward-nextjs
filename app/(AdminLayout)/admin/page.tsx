"use client";
import { Card, Carousel, Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts";
import { useState } from "react";

export default function page() {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      },
    },
    series: [
      {
        name: "Series 1",
        data: [30, 40, 45, 50, 49, 60, 70],
      },
    ],
  });

  return (
    <>
      <Row className="dashboard-page">
        <Col md={12} className="mb-3">
          <Carousel indicators={false}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={"/images/slider-1.png"}
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={"/images/slider-2.png"}
                alt="Second slide"
              />
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col className="d-flex mt-n5">
          <Col md={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Text>
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="pie"
                  />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Row>
              <Col md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Text>
                      <h6>Active Campaigns</h6>
                      <h3>2</h3>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Text>
                      <h6>Active Actions</h6>
                      <h3>2</h3>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Text>
                      <h6>Users</h6>
                      <h3>5</h3>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Text>
                      <h6>Packages</h6>
                      <h3>5</h3>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </>
  );
}
